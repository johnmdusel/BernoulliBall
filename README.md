# BernoulliBall

A simple web app for maintaining and visualizing an estimate of the success rate`p` for Bernoulli trials. A separate "evaluation" mode lets the user decide whether the success rate passes a requirement, such as being 50% confidence that the success rate is at least 0.8. 

We are unsure about the true success rate and represent this uncertainty in a Bayesian fashion.

- The estimated success rate is captured by the most likely value and a range of likely values; these are the posterior mode and the posterior highest density interval (at the given confidence level) respectively.

- A success rate is evaluated by checking whether the probability that the requirement is met is sufficiently high to be considered passing, or sufficiently low to be considered failing. *This approach is based on a decision-theoretic scenario applied to a sequential probability ratio test, with some simplifications to make elicitation more straightforward.*

---

## Key Features

### **Estimation Mode**

The app estimates of the success rate is made using a Beta prior distribution with a Bernoulli likelihood function. To get an estimate the user enters:

 - The *number of successes/failures*. These are used to set the posterior Beta distribution's parameters.

 - *Confidence level*: 1%–99%. In the backend, this is used for the mass of the posterior highest density interval (HDI)

The returned estimate comprises:

 - A *range of most likely success rates*. The HDI itself. 

 - The *most likely success rate*. The mode of the posterior Beta distribution.
 
#### **Data Visualization:**  
The UI shows:
	- A plot of the posterior PDF. 
	 - The mode is visually indicated on the plot.
	 - The HDI is shown as a highlighted region on the horizontal axis.
	- A textual summary of the estimate.


### **Evaluation Mode**

In evaluation mode the user enters:

- A requirement for the probability of success, *e.g.*,`p > 0.8`. *In the future, I might expand the user's options for specifying a requirement. Theoretically, any subset of [0, 1] will do.*

- A confidence level, *e.g.*, 95%. 

The app will determine whether---at the given confidence level---the probability of success 
- passes the requirement
- fails the requirement
- needs further testing to reach a definitive conclusion

The calculation is a Bayesian variant of the classical sequential probability ration test (SPRT) of Wald.
 
#### **Data Visualization:**  
The UI shows:
	- Entry fields for the requirement range.
	- A plot of the posterior PDF. 
	 - The requirement range is shown as a highlighted region on the horizontal axis.
	- A textual summary of the evaluation.




### **User Interaction:**  
   - Adjustable number of successes/failures.
   - Adjustable confidence level.
   - Adjustable requirment (in evaluation mode).
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

##  Example API responses

#### `/estimate`
 
```json
{
  "a": 3,
  "b": 5,
  "pdf": [
    { "x": 0.00, "y": 0.02 },
    { "x": 0.01, "y": 0.04 },
    // ...
  ],
  "hdi_mass": 0.95,
  "hdi_lower_x": 0.23,
  "hdi_upper_x": 0.70,
  "mode": 0.55
}
```


#### `/evaluate`

```json
{
  "a": 3,
  "b": 5,
  "pdf": [
    { "x": 0.00, "y": 0.02 },
    { "x": 0.01, "y": 0.04 },
    // ...
  ],
  "confidence": 0.95,
  "prob_requirement_met": 0.55,
  "evaluation": "Fail"
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
│   │   ├── components/       # Custom components
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

