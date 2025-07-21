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
                        inputProps={{ min: 0, max: 0.99, step: 0.01 }}
                        error={!isValidLo}
                        helperText={!isValidLo ? "Must be a decimal between 0 and 0.99." : ""}
                        required
                    />
                    <TextField
                        label="Upper"
                        type="number"
                        value={hi}
                        onChange={handleHi}
                        inputProps={{ min: 0.01, max: 1, step: 0.01 }}
                        error={!isValidHi}
                        helperText={!isValidHi ? "Must be a decimal between 0.01 and 1" : ""}
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

            const { a, b, confidence, prob_requirement_met, outcome } = evaluate;

            const probDisplay = prob_requirement_met != null ? prob_requirement_met.toFixed(2) : "N/A";

            return (
                <Card>
                    <CardContent>

                        {/* Plotting Beta PDF */}
                        {/*<LineChart*/}
                        {/*    width={400}*/}
                        {/*    height={200}*/}
                        {/*    data={pdf}*/}
                        {/*    margin={{ top: 10, bottom: 10, left: 10, right: 10 }} >*/}
                        {/*    <XAxis*/}
                        {/*        dataKey="x"*/}
                        {/*        type="number"*/}
                        {/*        domain={[0, 1]}>*/}
                        {/*        <Label*/}
                        {/*            value="Success Rate"*/}
                        {/*            offset={-5}*/}
                        {/*            position="insideBottom" />*/}
                        {/*    </XAxis>*/}
                        {/*    <YAxis*/}
                        {/*        dataKey="y"*/}
                        {/*        type="number"*/}
                        {/*        tick={false}>*/}
                        {/*        <Label*/}
                        {/*            value="Likelihood"*/}
                        {/*            offset={0}*/}
                        {/*            angle={-90}*/}
                        {/*            position="insideLeft" />*/}
                        {/*    </YAxis>*/}
                        {/*    <Line*/}
                        {/*        type="monotone"*/}
                        {/*        dataKey="y"*/}
                        {/*        stroke="#8884d8"*/}
                        {/*        dot={false}*/}
                        {/*        activeDot={false}*/}
                        {/*        isAnimationActive={false} />*/}

                        {/*    /!* Only show ReferenceArea if HDI exists *!/*/}
                        {/*    {hdi_lower_x != null && hdi_upper_x != null && (*/}
                        {/*        <ReferenceArea*/}
                        {/*            x1={lo}*/}
                        {/*            y1={0}*/}
                        {/*            x2={hi}*/}
                        {/*            y2={0.02 * mode_y}*/}
                        {/*            strokeOpacity={0.3}*/}
                        {/*            fill="red"*/}
                        {/*        />*/}
                        {/*    )}*/}

                        {/*</LineChart>*/}

                        {/*<Typography variant="caption" color="textSecondary">*/}
                        {/*    Showing # Successes: {a}, # Failures: {b}, Confidence Level: {hdi_mass}%*/}
                        {/*</Typography>*/}

                        <Typography>
                            Probability that requirement is met: <b>{probDisplay}</b>.
                            Evaluation: <b>{outcome}</b>.
                        </Typography>

                    </CardContent>
                </Card>
            );

        })()}
    </>
);

export default EvaluationComponent;