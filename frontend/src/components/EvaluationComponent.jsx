import React from 'react';
import { Card, CardContent, CircularProgress, Alert, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ReferenceArea, ReferenceDot, Label } from 'recharts';
import ParameterControls from './ParameterControls';

const EvaluationComponent = ({
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
        <Typography variant="h5" align="center">
            Under Development
        </Typography>
    </>
);

export default EvaluationComponent;