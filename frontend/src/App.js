import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceDot } from 'recharts';

// Dummy API endpoint from backend FastAPI
// const API_URL = 'http://localhost:8000/api/estimate';
const API_URL = 'http://localhost:8000/estimate';

function App() {

  // Set up state to hold estimate data
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend on mount
  useEffect(() => {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          setEstimate(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  if (!estimate) return <Typography>Error loading data</Typography>;

  // For display: extract the relevant values
  const { a, b, hdi_mass, pdf, hdi_lower, hdi_upper, mode } = estimate;

  return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Success Rate Estimate
        </Typography>
        <Card>
          <CardContent>
            {/* Plotting Beta PDF */}
            <LineChart width={400} height={200} data={pdf}>
              <XAxis dataKey="Success Rate" type="number" domain={[0, 1]} />
              <YAxis dataKey="Likelihood" type="number"/>
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#1976d2" dot={false} />
              {/* Highlight HDI */}
              <ReferenceArea x1={hdi_lower} x2={hdi_upper} strokeOpacity={0.3} fill="#90caf9" />
              {/* Show the mode */}
              <ReferenceDot x={mode} y={Math.max(...pdf.map(p => p.y))} r={5} fill="#388e3c" />
            </LineChart>
            {/* Display statistics */}
            <Typography>
              Success rate is between <b>{hdi_lower.toFixed(2)}</b> and <b>{hdi_upper.toFixed(2)}</b>
              {" "}at {Math.round(hdi_mass * 100)}% confidence. <br/>
              Most likely success rate is <b>{mode.toFixed(2)}</b>.
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Parameters: a = {a}, b = {b}
            </Typography>
          </CardContent>
        </Card>
      </Container>
  );
}

export default App;
