# BernoulliBall

## Purpose
A web app for maintaining and visualizing an estimate of the probability of success for Bernoulli trials. I am using this project to learn about frontend+backend development concepts.

---

## Key Features

1. **Estimate Structure:**  
   - The estimation of the success rate is made using a Beta prior distribution with a Bernoulli likelihood function. 
   - An estimate is defined by:
     - The *number of successes/failures*. These are the Beta distribution's parameters.
     - *Confidence level*: 1%–99%.
     - A *range of most likely success rates*. This is the posterior highest density interval (HDI). 
     - The *most likely success rate*. This is the mode of the posterior Beta distribution.

2. **Data Visualization:**  
The UI shows:
	- A plot of the posterior PDF. 
	 - The mode is visually indicated on the plot.
	 - The HDI is shown as a highlighted region on the horizontal axis.
	- A textual summary of the estimate.

3. **User Interaction:**  
   - Adjustable number of successes/failures.
   - Adjustable confidence level.
   - Session-based and anonymous. No authentication, persistence, import, or export.

---

## Project Components

- **Frontend:**
  - React for UI
  - Material UI for UI components
  - Recharts for plotting

- **Backend:**
  - FastAPI (Python) for the API
  - Implements the HDI calculation in Python
  - Exposes API endpoint(s) for the frontend to fetch API response

- **Deployment/Infrastructure:**
  - The frontend and backend are packaged in their own Docker containers.

---

## API Contract

The names used in the code will differ from the user-facing terminology. 
For example, the user will see "confidence level" but the code will use `hdi_mass`. 

### **Example API response:**
 
```
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

## Directory structure 

```
BernoulliBall/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI entrypoint
│   │   ├── api.py            # API routes
│   │   ├── models.py         # Pydantic models (request/response)
│   │   └── utils.py          # Math lives here
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── README.md
```

## Dockerized Backend and Frontend

To build the backend/frontend containers  
```shell
docker compose build
```

Going forward, just use `docker compose up` to run. To remove containers and the internal Docker network, run `docker compose down`.
