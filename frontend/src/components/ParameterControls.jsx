import React from 'react';
import { TextField, Box } from '@mui/material';

const ParameterControls = ({
       a, handleA, isValidA,
       b, handleB, isValidB,
       hdiMass, handleHdi, isValidHdi,
   }) => (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
            label="# Successes"
            type="number"
            value={a}
            onChange={handleA}
            inputProps={{ min: 1, step: 1 }}
            error={!isValidA}
            helperText={!isValidA ? "Must be a positive integer" : ""}
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
            helperText={!isValidB ? "Must be a positive integer" : ""}
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
            helperText={!isValidHdi ? "Must be an integer between 0 and 100 (exclusive)" : ""}
            required
            fullWidth
        />
    </Box>
);

export default ParameterControls;