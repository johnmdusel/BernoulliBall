import React from 'react';
import { Card, CardContent, CircularProgress, Alert, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ReferenceArea, ReferenceDot, Label } from 'recharts';
import ParameterControls from './ParameterControls';

const EstimationComponent = ({
     a, handleA, isValidA,
     b, handleB, isValidB,
     hdiMass, handleHdi, isValidHdi,
     errorMsg, loading, estimate
 }) => (
    <>
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
    </>
);

export default EstimationComponent;