import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ReferenceArea, Cross, ReferenceDot, Label } from 'recharts';

const API_URL = 'http://localhost:8000/estimate';

function App() {

  // Set up state to hold estimate data
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend on mount
  useEffect(() => {
    fetch(API_URL)  // Make HTTP GET request to backend
        .then(res => res.json())  // Wait for response then parse as JSON
        .then(data => {
          setEstimate(data);  // Save result in React state
          setLoading(false);  // Indicate loading is complete
        })
        .catch(() => setLoading(false));  // Stop loading (leave estimate null) if any error
  }, []);

  if (loading) return <CircularProgress />;

  if (!estimate) return <Typography>Error loading data</Typography>;

  const { a, b, hdi_mass, pdf, hdi_lower_x, hdi_lower_y, hdi_upper_x, hdi_upper_y, mode } = estimate;

  const mode_y = Math.max(...pdf.map(p => p.y))

  return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Success Rate Estimate
        </Typography>
        <Card>
          <CardContent>
            {/* Plotting Beta PDF */}
            <LineChart width={400} height={200} data={pdf} margin={{top: 10, bottom: 10, left: 10, right: 10}} >
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
