import React from 'react';
import {Card, CardContent, CircularProgress, Alert, Typography, TextField, Box} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ReferenceArea, Label } from 'recharts';
import ParameterControls from './ParameterControls';

const EvaluationComponent = ({
    a, handleA, isValidA,
    b, handleB, isValidB,
    confidence, handleConfidence, isValidConfidence,
    lo, handleLo, isValidLo,
    hi, handleHi, isValidHi,
    isValidRequirement,
    errorMsg, loading, evaluate
 }) => (
    <>
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <ParameterControls
                    a={a} handleA={handleA} isValidA={isValidA}
                    b={b} handleB={handleB} isValidB={isValidB}
                    confidence={confidence} handleConfidence={handleConfidence} isValidConfidence={isValidConfidence}
                />
                <Box>
                    <Typography>
                        Lower/upper endpoints for required range
                    </Typography>
                    <TextField
                        label="Lower"
                        type="number"
                        value={lo}
                        onChange={handleLo}
                        slotProps={{ input: {min: 0, max: 1, step: 0.05} }}
                        error={!(isValidLo & isValidRequirement)}
                        helperText={!isValidLo ? "Must be between 0 and 1 but less than 'Upper'." : ""}
                        required
                    />
                    <TextField
                        label="Upper"
                        type="number"
                        value={hi}
                        onChange={handleHi}
                        slotProps={{ input: {min: 0, max: 1, step: 0.05} }}
                        error={!(isValidHi & isValidRequirement)}
                        helperText={!isValidHi ? "Must be between 0 and 1 but greater than 'Lower'" : ""}
                        required
                    />
                </Box>
            </CardContent>
        </Card>

        {/* Error message */}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        {/* Loading or chart */}
        {loading && <CircularProgress />}
        {!loading && evaluate && (() => {

            const { pdf, prob_requirement_met, evaluation } = evaluate;

            // const probDisplay = prob_requirement_met != null ? prob_requirement_met : "N/A";
            const probDisplay = prob_requirement_met != null ? prob_requirement_met : "N/A";
            const evaluationDisplay = evaluation != null ? evaluation : "N/A";
            const confidenceDisplay = confidence != null ? confidence : "N/A";

            return (
                <Card>
                    <CardContent>

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
                                domain={[-0.01, 1]}
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
                            {lo != null && hi != null && (
                                <ReferenceArea
                                    x1={lo}
                                    y1={-0.01}
                                    x2={hi}
                                    y2={0.01}
                                    strokeOpacity={0.3}
                                    fill="red"
                                />
                            )}

                        </LineChart>

                        <Typography variant="caption" color="textSecondary">
                            Showing # Successes: {a}, # Failures: {b}, Requirement: Between {lo} and {hi}.
                        </Typography>

                        <Typography
                            // align="center"
                        >
                            Probability that requirement is met: <b>{probDisplay}</b>.
                            <br/>
                            Evaluation: <b>{evaluationDisplay}</b> (at {confidenceDisplay}% confidence).
                        </Typography>

                    </CardContent>
                </Card>
            );

        })()}
    </>
);

export default EvaluationComponent;