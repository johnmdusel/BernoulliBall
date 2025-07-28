import React, {useEffect, useState} from 'react';
import { Container, Typography, Tab, Tabs } from '@mui/material';
import EstimationComponent from './components/EstimationComponent';
import EvaluationComponent from './components/EvaluationComponent';

const API_URL_ESTIMATE = 'http://localhost:8000/estimate';
const API_URL_EVALUATE = 'http://localhost:8000/evaluate';

function App() {
    // Parameter state
    const [a, setA] = useState(1);
    const [b, setB] = useState(1);
    const [hdiMass, setHdiMass] = useState(95);
    const [confidence, setConfidence] = useState(95);
    const [lo, setLo] = useState(0);
    const [hi, setHi] = useState(1);
    const [appMode, setAppMode] = useState("Estimate")

    // Data and loading state
    const [estimate, setEstimate] = useState(null);
    const [evaluate, setEvaluate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (appMode === "Estimate") {
            fetchEstimate(a, b, hdiMass);
        } else if (appMode === "Evaluate") {
            fetchEvaluate(a, b, confidence, lo, hi);
        }
        // already call fetch on each param change in the handlers
        // eslint-disable-next-line
    }, [appMode]);

    // Fetches the estimate with provided parameters, after validation
    function fetchEstimate(aVal, bVal, hdiVal) {
        if (!(Number.isInteger(aVal) && aVal > 0)) return;
        if (!(Number.isInteger(bVal) && bVal > 0)) return;
        if (!(Number.isInteger(hdiVal) && hdiVal > 0 && hdiVal < 100)) return;

        setLoading(true);
        setErrorMsg("");
        fetch(`${API_URL_ESTIMATE}?a=${aVal}&b=${bVal}&hdi_mass=${hdiVal}`)
            .then(res => {
                if (!res.ok) throw new Error("Backend validation failed");
                return res.json();
            })
            .then(data => {
                setEstimate(data);
                setLoading(false);
            })
            .catch(err => {
                setEstimate(null);
                setLoading(false);
                setErrorMsg("Failed to fetch estimate: " + err.message);
            });
    }

    function fetchEvaluate(aVal, bVal, confVal, loVal, hiVal) {
        if (!(Number.isInteger(aVal) && aVal > 0)) return;
        if (!(Number.isInteger(bVal) && bVal > 0)) return;
        if (!(Number.isInteger(confVal) && confVal > 0 && confVal < 100)) return;
        if (!(loVal >= 0 && loVal < 1)) return;
        if (!(hiVal > 0 && hiVal <= 1)) return;
        if (!(loVal < hiVal)) return;

        setLoading(true);
        setErrorMsg("");
        fetch(`${API_URL_EVALUATE}?a=${aVal}&b=${bVal}&confidence=${confVal}&lo=${loVal}&hi=${hiVal}`)
            .then(res => {
                if (!res.ok) throw new Error("Backend validation failed");
                return res.json();
            })
            .then(data => {
                setEvaluate(data);
                setLoading(false);
            })
            .catch(err => {
                setEvaluate(null);
                setLoading(false);
                setErrorMsg("Failed to fetch evaluation: " + err.message);
            })
    }

    // Validation logic
    const isValidA = Number.isInteger(a) && a > 0;
    const isValidB = Number.isInteger(b) && b > 0;
    const isValidHdi = Number.isInteger(hdiMass) && hdiMass > 0 && hdiMass < 100;
    const isValidConfidence = Number.isInteger(confidence) && confidence > 0 && confidence < 100;
    const isValidLo = lo >= 0 && lo < 1
    const isValidHi = hi > 0 && hi <= 1
    const isValidRequirement = lo < hi

    // Handlers
    const handleA = e => {
        const val = parseInt(e.target.value, 10);
        const newA = Number.isNaN(val) ? "" : Math.max(1, val);
        setA(newA);
        appMode === "Estimate" ? fetchEstimate(newA, b, hdiMass)
                               : fetchEvaluate(newA, b, confidence, lo, hi);
    };
    const handleB = e => {
        const val = parseInt(e.target.value, 10);
        const newB = Number.isNaN(val) ? "" : Math.max(1, val);
        setB(newB);
        appMode === "Estimate" ? fetchEstimate(a, newB, hdiMass)
                               : fetchEvaluate(a, newB, confidence, lo, hi);
    };
    const handleHdi = e => {
        const val = parseInt(e.target.value, 10);
        const newHdi = Number.isNaN(val) ? "" : val;
        setHdiMass(newHdi);
        fetchEstimate(a, b, newHdi); // use current a, b
    };
    const handleConfidence = e => {
        const val = parseInt(e.target.value, 10);
        const newConfidence = Number.isNaN(val) ? "" : val;
        setConfidence(newConfidence);
        fetchEvaluate(a, b, newConfidence, lo, hi);
    };
    const handleLo = e => {
        const val = parseFloat(e.target.value);
        const newLo = Number.isNaN(val) ? "" : Math.max(0, val);        
        setLo(newLo);
        fetchEvaluate(a, b, confidence, newLo, hi);
    }
    const handleHi = e => {
        const val = parseFloat(e.target.value);
        const newHi = Number.isNaN(val) ? "" : Math.min(1, val);
        setHi(newHi);
        fetchEvaluate(a, b, confidence, lo, newHi);
    }
    const handleAppModeChange = (e, newAppMode) => {
        setAppMode(newAppMode);
    }

    console.log(`a=${a}, b=${b}`)

    return (
        <Container
            maxWidth="sm"
            sx={{mt: 4}}
        >
            <Typography variant="h5" align="center" gutterBottom>
                BernoulliBall: Success Rate Tool
            </Typography>
            <Tabs
                value={appMode}
                onChange={handleAppModeChange}
                variant="fixedWidth"
                centered
            >
                <Tab label="Estimation Mode" value="Estimate"/>
                <Tab label="Evaluation Mode" value="Evaluate"/>
            </Tabs>
            {
                appMode === "Estimate" ? <EstimationComponent
                                            a={a} handleA={handleA} isValidA={isValidA}
                                            b={b} handleB={handleB} isValidB={isValidB}
                                            hdiMass={hdiMass} handleHdi={handleHdi} isValidHdi={isValidHdi}
                                            errorMsg={errorMsg} loading={loading} estimate={estimate}
                                         />
                                       : <EvaluationComponent
                                            a={a} handleA={handleA} isValidA={isValidA}
                                            b={b} handleB={handleB} isValidB={isValidB}
                                            confidence={confidence} handleConfidence={handleConfidence} isValidConfidence={isValidConfidence}
                                            lo={lo} handleLo={handleLo} isValidLo={isValidLo}
                                            hi={hi} handleHi={handleHi} isValidHi={isValidHi}
                                            isValidRequirement={isValidRequirement}
                                            errorMsg={errorMsg} loading={loading} evaluate={evaluate}
                                         />
            }
        </Container>
    );
}

export default App;