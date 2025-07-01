import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, TextField, Button, Box, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ReferenceArea, ReferenceDot, Label } from 'recharts';

const API_URL = 'http://localhost:8000/estimate';

function App() {
    // Parameter state
    const [a, setA] = useState(1);
    const [b, setB] = useState(1);
    let [hdiMass, setHdiMass] = useState(95);

    // Data and loading state
    const [estimate, setEstimate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Validation logic
    const isValidA = Number.isInteger(a) && a > 0;
    const isValidB = Number.isInteger(b) && b > 0;
    const isValidHdi = Number.isInteger(hdiMass) && hdiMass > 0 && hdiMass < 100;
    const isValid = isValidA && isValidB && isValidHdi;

    // // Fetch from backend
    // const fetchEstimate = (params = {}) => {
    //     setLoading(true);
    //     setErrorMsg("");
    //     const url = `${API_URL}?a=${params.a ?? a}&b=${params.b ?? b}&hdi_mass=${params.hdiMass ?? hdiMass}`;
    //     fetch(url)
    //         .then(res => {
    //             if (!res.ok) throw new Error("Backend validation failed");
    //             return res.json();
    //         })
    //         .then(data => {
    //             setEstimate(data);
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             setEstimate(null);
    //             setLoading(false);
    //             setErrorMsg("Failed to fetch estimate: " + err.message);
    //         });
    // };

    // // Initial fetch
    // useEffect(() => {
    //     fetchEstimate();
    //     // eslint-disable-next-line
    // }, []);

    // Handlers
    const handleA = e => {
        const val = parseInt(e.target.value, 10);
        setA(Number.isNaN(val) ? "" : Math.max(1, val));
    };
    const handleB = e => {
        const val = parseInt(e.target.value, 10);
        setB(Number.isNaN(val) ? "" : Math.max(1, val));
    };
    const handleHdi = e => {
        const val = parseInt(e.target.value, 10);
        setHdiMass(Number.isNaN(val) ? "" : val);
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        setErrorMsg("");
        fetch(`${API_URL}?a=${a}&b=${b}&hdi_mass=${hdiMass/100}`)
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
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Success Rate Estimate
            </Typography>
            {/* Parameter controls */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="# Successes"
                                type="number"
                                value={a}
                                onChange={handleA}
                                inputProps={{ min: 1, step: 1 }}
                                error={!isValidA}
                                helperText={!isValidA ? "Must be integer > 0" : ""}
                                required
                                fullWidth
                            />
                            <TextField
                                label="# Failures"
                                type="number"
                                value={b}
                                onChange={handleB}
                                inputProps={{ min: 1, step: 1 }}
                                error={!isValidB}
                                helperText={!isValidB ? "Must be integer > 0" : ""}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Confidence Level (%)"
                                type="number"
                                value={hdiMass}
                                onChange={handleHdi}
                                inputProps={{ min: 1, max: 99, step: 1 }}
                                error={!isValidHdi}
                                helperText={!isValidHdi ? "Must be integer between 0 and 100 (exclusive)" : ""}
                                required
                                fullWidth
                            />
                        </Box>
                        <Button type="submit" variant="contained" color="primary" disabled={!isValid || loading}>
                            Update Estimate
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {/* Error message */}
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            {/* Loading or chart */}
            {loading && <CircularProgress />}
            {!loading && estimate && (() => {
                const { a, b, hdi_mass, pdf, hdi_lower_x, hdi_lower_y, hdi_upper_x, hdi_upper_y, mode } = estimate;
                const mode_y = Math.max(...pdf.map(p => p.y));
                return (
                    <Card>
                        <CardContent>
                            {/* Plotting Beta PDF */}
                            <LineChart width={400} height={200} data={pdf} margin={{ top: 10, bottom: 10, left: 10, right: 10 }} >
                                <XAxis dataKey="x" type="number" domain={[0, 1]}>
                                    <Label value="Success Rate" offset={-5} position="insideBottom" />
                                </XAxis>
                                <YAxis dataKey="y" type="number" tick={false}>
                                    <Label value="Likelihood" offset={0} angle={-90} position="insideLeft" />
                                </YAxis>
                                <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} activeDot={false} />
                                <ReferenceArea
                                    x1={hdi_lower_x}
                                    y1={0}
                                    x2={hdi_upper_x}
                                    y2={0.02 * mode_y}
                                    strokeOpacity={0.3}
                                    fill="red" />
                                {/* Show the mode */}
                                <ReferenceDot x={mode} y={mode_y} r={5} fill="#388e3c" />
                            </LineChart>
                            {/* Display statistics */}
                            <Typography>
                                Success rate is between <b>{hdi_lower_x.toFixed(2)}</b> and <b>{hdi_upper_x.toFixed(2)}</b>
                                {" "}at {Math.round(hdi_mass * 100)}% confidence. <br />
                                Most likely success rate is <b>{mode.toFixed(2)}</b>.
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Parameters: a = {a}, b = {b}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            })()}
        </Container>
    );
}

export default App;