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
   - The HDI $[L, U]$ is shown as a highlighted region on the horizontal axis of the PDF plot.
   - The mode $p^*$ is visually indicated on the plot.
   - A message like "Success rate is between $L$ and $U$ (at confidence level), most likely success rate is $p^*$."

4. **User Interaction:**  
   - User can set prior values for $a, b$ when creating an estimate.
   - Users can increment or decrement $a, b$ by 1 using up/down arrow buttons.
   - Session-based and anonymous. No authentication, persistence, import, or export.

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
	  + [https://recharts.org/en-US/api/LineChart](`LineChart`) for PDF
	  + [https://recharts.org/en-US/api/ReferenceArea](`ReferenceArea`) for HDI band 
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

### 1. (DONE) Define the API Contract  
**Goal:** Clearly specify the shape and content of data exchanged between backend and frontend.

The names used in the code will differ from the user-facing terminology. For example, the user will see "confidence level" but the code will use `hdi_mass`. When I'm writing in this file I"ll use $L, U$ but the code will use `hdi_lower, hdi_upper`.

#### **Example API response:**  
 
```json
{
  "a": 3,
  "b": 5,
  "hdi_mass": 0.95,
  "pdf": [
    { "x": 0.00, "y": 0.02 },
    { "x": 0.01, "y": 0.04 },
    // ...
  ],
  "hdi_lower": 0.23,
  "hdi_upper": 0.70,
  "mode": 0.55
}
```

### 2. (DONE) Setup directory structure 

```
BernoulliBall/
├── backend/                  # FastAPI app lives here
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI entrypoint
│   │   ├── api.py            # API routes
│   │   ├── models.py         # Pydantic models (request/response)
│   │   └── utils.py          # HDI and Beta PDF logic
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React app lives here
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── project_summary.md
```

### 3. Draft Backend Skeleton (FastAPI)
- Scaffold endpoint(s) that return the example response with dummy data.

### 4. Draft Frontend Skeleton (React + Material UI + Recharts)
- Build a UI that queries the backend and displays the plot and statistics using the agreed API contract.

### 5. Dockerize Backend and Frontend
- Write Dockerfiles for both, and a `docker-compose.yml` to orchestrate them.

### 6. Document Everything
- Update README with API contract, setup, and usage instructions.
