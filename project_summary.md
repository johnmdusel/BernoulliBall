# Project Summary: BernoulliBall

## Purpose
A web app for maintaining and visualizing multiple independent estimates of the probability of success for Bernoulli trials, with a focus on clean, minimalist user experience and learning full-stack (frontend/backend) development concepts.

---

## Key Features

1. **Multi-Estimate Support:**  
   Users can manage several independent probability estimates in a single session.

2. **Estimate Structure:**  
   - Each estimate is defined by:
     - Beta distribution parameters: $a$ and $b$ (user sets initial values)
     - Confidence level: 1%–99% (user-specified)
     - The highest density interval (HDI): $L \le p \le U$.
     - The most likely value $p^*$

3. **Data Visualization:**  
For each estimate, display 
   - The beta distribution PDF over [0, 1].
   - The HDI $L \le p \le U$ is shown as a shaded region.
   - The mode $p^*$ is visually indicated on the plot.
   - A message like "Success rate is between $L$ and $U$ (at confidence level), most likely value is $p^*$."

4. **User Interaction:**  
   - Users can set prior values for $a, b$ when creating an estimate.
   - Users can increment or decrement $a, b$ by 1 using up/down arrow buttons.
   - No authentication, persistence, import, or export – session-based and anonymous.

5. **Design:**  
   - Minimalist and clean UI.
   - Minimal interactivity beyond what is necessary for the above features.

6. **Open Source:**  
   The project will be open source from the start.

---

## Tech Stack (Finalized)

- **Frontend:**  
  - React for UI  
  - Material UI for UI components  
  - Recharts for plotting beta distribution and HDI  
  - Containerized using Docker

- **Backend:**  
  - FastAPI (Python) for the API  
  - Implements the HDI calculation in Python  
  - Exposes API endpoint(s) for the frontend to fetch $L, U, p^*$, and plot data  
  - Containerized using Docker

- **Deployment/Infrastructure:**  
  - Both frontend and backend are packaged in their own Docker containers for easy development, testing, and deployment  
  - Can be orchestrated together using Docker Compose

---

## Next Steps

### 1. Define the API Contract  
**Goal:** Clearly specify the shape and content of data exchanged between backend and frontend.

#### Substeps:
- **a. Specify plot data structure:**  
  - Since we are using Recharts, the PDF should be sent as an array of objects:  
    ```json
    [
      {"x": 0.00, "y": 0.12},
      {"x": 0.01, "y": 0.13},
      ...
    ]
    ```
- **b. Specify HDI shading data:**  
  - Decide how to communicate which points should be shaded (under the HDI interval [L, U]).  
  - Options include:
    - Add a boolean flag to each point object (e.g., `{ "x": 0.23, "y": 0.15, "in_hdi": true }`)
    - Specify HDI endpoints separately, and the frontend identifies points within the interval
    - Return a separate array of (x, y) pairs just for the HDI region
- **c. Specify additional statistics:**  
  - Include mode, mean, a, b, confidence_level, L, U as separate fields in the JSON.
- **d. Draft example API response:**  
  - Assemble a sample JSON object reflecting all the above.

### 2. Draft Backend Skeleton (FastAPI)
- Scaffold endpoint(s) that return the example response with dummy data.

### 3. Draft Frontend Skeleton (React + Material UI + Recharts)
- Build a UI that queries the backend and displays the plot and statistics using the agreed API contract.

### 4. Dockerize Backend and Frontend
- Write Dockerfiles for both, and a `docker-compose.yml` to orchestrate them.

### 5. Document Everything
- Update README with API contract, setup, and usage instructions.

---

**Summary:**  
BernoulliBall will now use Recharts for plotting, with plot data passed as an array of objects. The next major task is to finalize the API contract, especially for representing HDI shading, before building out backend and frontend skeletons.