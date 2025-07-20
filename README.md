# BernoulliBall

A web app for maintaining and visualizing an estimate of the success rate`p` for Bernoulli trials. We are unsure about the true value of the success rate and represent this uncertainty in a Bayesian fashion. 

###### I am using this project to learn about full-stack development concepts.

---

## Branch `evaluation-mode` (under development)

Development branch for "evaluation mode" feature. 
The user will use a selector to run the app in "estimation mode" or "evaluation mode".

---

## Key Features

### **Estimation Mode**

We're un
The app estimates of the success rate is made using a Beta prior distribution with a Bernoulli likelihood function. To get an estimate the user enters:

 - The *number of successes/failures*. These are used to set the posterior Beta distribution's parameters.

 - *Confidence level*: 1%–99%. In the backend, this is used for the mass of the posterior highest density interval (HDI)

The returned estimate comprises:

 - A *range of most likely success rates*. The HDI itself. 

 - The *most likely success rate*. The mode of the posterior Beta distribution.


### **Evaluation Mode**

In evaluation mode the user enters:

- A requirement for the probability of success, *e.g.*,`p > 0.8`. Later, I might expand the user's options for specifying a requirement. Theoretically, any subset of [0, 1] will do.
- A confidence level, *e.g.*, 95%. 

The app will determine whether---at the given confidence level---the probability of success 
- passes the requirement
- fails the requirement
- is indeterminate in the sense that further observations are needed to reach a definitive conclusion

The calculation is a Bayesian variant of the classical sequential probability ration test (SPRT) of Wald.


### **Data Visualization:**  
The UI shows:
	- A plot of the posterior PDF. 
	 - The mode is visually indicated on the plot.
	 - The HDI is shown as a highlighted region on the horizontal axis.
	- A textual summary of the estimate.

### **User Interaction:**  
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

### **Example API responses**

#### `/estimate`
 
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


#### `/evaluate`

```json
{
  "a": 3,
  "b": 5,
  "confidence": 0.95,
  "lo": 0.8,
  "hi": 1.0,
  "prob_requirements_met": 0.55,
  "sprt_evaluationeval": "Fail"
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
│   │   ├── enums.py          # Operating modes/SPRT outcomes
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
