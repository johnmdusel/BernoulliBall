## Building the frontend skeleton

## 1. **Project Structure Overview**

Your frontend directory should look like this:
```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── App.js
│   └── index.js
├── package.json
└── Dockerfile
```

- **public/**: Static files (e.g., `index.html`)
- **src/**: Source code for your app
    - **components/**: Where reusable UI pieces go
    - **App.js**: Main React component
    - **index.js**: Entry point for the React app
- **package.json**: Lists project dependencies


[//]: # (## 2. **Setting Up the Frontend**)

[//]: # ()
[//]: # (Temporary `Dockerfile` to build the React app)

[//]: # ()
[//]: # (```dockerfile)

[//]: # (FROM node:20)

[//]: # (WORKDIR /usr/src/app)

[//]: # (CMD [ "bash" ])

[//]: # (```)

[//]: # ()
[//]: # (Build the image and run it with a remote mount)

[//]: # ()
[//]: # (```)

[//]: # (docker build -t bernoulli-frontend-dev .)

[//]: # (docker run -it --rm -v "$PWD":/usr/src/app bernoulli-frontend-dev)

[//]: # (```)

[//]: # ()
[//]: # (Inside the container, create the React app using [Create React App]&#40;https://react.dev/learn/start-a-new-react-project&#41;:)

[//]: # ()
[//]: # (```bash)

[//]: # (npx create-react-app .)

[//]: # (```)

[//]: # ()
[//]: # (Install Material UI and Recharts:)

[//]: # ()
[//]: # (```bash)

[//]: # (npm install @mui/material @emotion/react @emotion/styled recharts)

[//]: # (```)

[//]: # ()
[//]: # (Once the structural files are created and the dependencies are installed, go ahead and remove the `bernoulli-frontend-dev` image. )


## 3. **Understanding the Skeleton**

Your goal here is to build a minimal UI that:
- Fetches and displays probability estimate data from the backend (for now, this can be dummy data).
- Plots the Beta distribution and highlights the HDI.
- Shows the mode and statistics.

---

## 4. **Step-by-Step: Building the Skeleton**

### a. **App.js – The Main Component**

#### What this file does:
- Fetches data from the backend API (dummy data for now).
- Displays a chart and statistics.

#### Steps:

1. **Import dependencies** (React, Material UI, Recharts).
2. **Set up state** to hold the estimate data.
3. **Fetch data from backend** using `useEffect`.
4. **Display the plot** using Recharts.
5. **Display the data** (mode, HDI, etc.) using Material UI components.


### c. **index.js – Entry Point**

This file rarely needs changes. It just renders `App`:


## 5. **Next Steps**

- **Test your skeleton:** Run the backend (see `backend/`) and frontend (in `frontend/` use `docker run --rm -it -v "$PWD":/usr/src/app -p 3000:3000 bernoulliball-frontend`). You should see a plot and the statistics.
- **Adjust API_URL** if your backend runs on a different port.
- **If you get CORS errors:** You might need to allow localhost:3000 in your FastAPI CORS settings.
