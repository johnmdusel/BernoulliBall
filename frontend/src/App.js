import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, TextField, Box, Alert, Tab, Tabs } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ReferenceArea, ReferenceDot, Label } from 'recharts';
import ParameterControls from './components/ParameterControls'

const API_URL_ESTIMATE = 'http://localhost:8000/estimate';
const API_URL_EVALUATE = 'http://localhost:8000/evaluate';

function App() {
    // Parameter state
    const [a, setA] = useState(1);
    const [b, setB] = useState(1);
    let [hdiMass, setHdiMass] = useState(95);
    let [confidence, setConfidence] = useState(95);
    let [lo, setLo] = useState(0);
    let [hi, setHi] = useState(1);
    let [appMode, setAppMode] = useState("Estimate")

    // Data and loading state
    const [estimate, setEstimate] = useState(null);
    const [evaluate, setEvaluate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Fetches the estimate with provided parameters, after validation
    function fetchEstimate(aVal, bVal, hdiVal) {
        if (!(Number.isInteger(aVal) && aVal > 0)) return;
        if (!(Number.isInteger(bVal) && bVal > 0)) return;
        if (!(Number.isInteger(hdiVal) && hdiVal > 0 && hdiVal < 100)) return;

        setLoading(true);
        setErrorMsg("");
        // backend wants 0 < hdi_mass < 1
        fetch(`${API_URL_ESTIMATE}?a=${aVal}&b=${bVal}&hdi_mass=${hdiVal/100}`)
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
        // backend wants 0 < confidence < 1
        fetch(`${API_URL_EVALUATE}?a=${aVal}&b=${bVal}&confidence=${confVal/100}&lo=${loVal}&hi=${hiVal}`)
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

    // Handlers
    const handleA = e => {
        const val = parseInt(e.target.value, 10);
        const newA = Number.isNaN(val) ? "" : Math.max(1, val);
        setA(newA);
        fetchEstimate(newA, b, hdiMass); // use current b, hdiMass
    };
    const handleB = e => {
        const val = parseInt(e.target.value, 10);
        const newB = Number.isNaN(val) ? "" : Math.max(1, val);
        setB(newB);
        fetchEstimate(a, newB, hdiMass); // use current a, hdiMass
    };
    const handleHdi = e => {
        const val = parseInt(e.target.value, 10);
        const newHdi = Number.isNaN(val) ? "" : val;
        setHdiMass(newHdi);
        fetchEstimate(a, b, newHdi); // use current a, b
    };
    const handleConfidence = e => {
        const val = parseInt(e.target.value, 10);
        const newConfidence = Number.isNan(val) ? "" : val;
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
    const handleAppModeChange = e => {
        const val = e.target.value;
        const newAppMode = val;  // TODO validate
        setAppMode(newAppMode);
    }

    // return (
    //     <Container
    //         maxWidth="sm"
    //         sx={{mt: 4}}
    //     >
    //         <Typography variant="h5" align="center" gutterBottom>
    //             BernoulliBall: Success Rate Tool
    //         </Typography>
    //         <Tabs
    //             value={appMode}
    //             onChange={handleAppModeChange}
    //             variant="fixedWidth"
    //             centered
    //         >
    //             <Tab label="Estimation Mode" value="Estimate"/>
    //             <Tab label="Evaluation Mode" value="Evaluate"/>
    //         </Tabs>
    //         {/*{*/}
    //         {/*    appmode === "Estimate" ? <EstimationComponent/> */}
    //         {/*        : <EvaluationComponent/>*/}
    //         {/*}*/}
    //     </Container>
    // )

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                BernoulliBall -- Uncertainty Management Tool
            </Typography>
            {/* Parameter controls */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <ParameterControls
                        a={a} handleA={handleA} isValidA={isValidA}
                        b={b} handleB={handleB} isValidB={isValidB}
                        hdiMass={hdiMass} handleHdi={handleHdi} isValidHdi={isValidHdi}
                    />
                </CardContent>
            </Card>
            {/* Error message */}
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            {/* Loading or chart */}
            {loading && <CircularProgress />}
            {!loading && estimate && (() => {
                const { a, b, hdi_mass, pdf, hdi_lower_x, hdi_upper_x, mode } = estimate;
                const mode_y = Math.max(...pdf.map(p => p.y));
                return (
                    <Card>
                        <CardContent>
                            {/* Plotting Beta PDF */}
                            <LineChart
                                width={400}
                                height={200}
                                data={pdf}
                                margin={{ top: 10, bottom: 10, left: 10, right: 10 }} >
                                <XAxis
                                    dataKey="x"
                                    type="number"
                                    domain={[0, 1]}>
                                    <Label
                                        value="Success Rate"
                                        offset={-5}
                                        position="insideBottom" />
                                </XAxis>
                                <YAxis
                                    dataKey="y"
                                    type="number"
                                    tick={false}>
                                    <Label
                                        value="Likelihood"
                                        offset={0}
                                        angle={-90}
                                        position="insideLeft" />
                                </YAxis>
                                <Line
                                    type="monotone"
                                    dataKey="y"
                                    stroke="#8884d8"
                                    dot={false}
                                    activeDot={false}
                                    isAnimationActive={false} />
                                {/* Only show ReferenceArea if HDI exists */}
                                {hdi_lower_x != null && hdi_upper_x != null && (
                                    <ReferenceArea
                                        x1={hdi_lower_x}
                                        y1={0}
                                        x2={hdi_upper_x}
                                        y2={0.02 * mode_y}
                                        strokeOpacity={0.3}
                                        fill="red"
                                    />
                                )}
                                {/* Only show ReferenceDot if mode exists */}
                                {mode != null && (
                                    <ReferenceDot x={mode} y={mode_y} r={5} fill="#388e3c" />
                                )}
                            </LineChart>
                            <Typography variant="caption" color="textSecondary">
                                Showing # Successes: {a}, # Failures: {b}, Confidence Level: {hdi_mass}%
                            </Typography>
                            <Typography>
                                <br/>
                                Success rate is most likely <b>{mode != null ? mode.toFixed(2) : "N/A"}</b>,
                                but could be between {" "}
                                <b>
                                    {hdi_lower_x != null ? hdi_lower_x.toFixed(2) : "N/A"}
                                </b>
                                {" "} and {" "}
                                <b>
                                    {hdi_upper_x != null ? hdi_upper_x.toFixed(2) : "N/A"}
                                </b>.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            })()}
        </Container>
    );
}

export default App;