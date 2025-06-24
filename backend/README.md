# BernoulliBall `backend`

## Testing 

```
docker build -t bernoulliball-backend .
docker run -p 8000:8000 bernoulliball-backend
```

Access [http://localhost:8000/estimate](http://localhost:8000/estimate). 
You should see a JSON response with dummy data matching the API contract in `project_summary.md`.

Access the interactive API docs [http://localhost:8000/docs](http://localhost:8000/docs).
You can test the `/estimate` endpoint with different query parameters.