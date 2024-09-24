This is a basic CRUD backend in FastAPI attached to a postgres db running in Docker. 

Initial Setup:

1. make sure you're using python 3.10+

2. create a venv in /backend:
   
    ```python3 -m venv .venv```
   
4. activate the venv in /backend
   
    ```source .venv/bin/activate```

5. install the dependencies in /backend

   ```pip3 install -r requirements.txt```

6. start the postgres container in /backend

    ```docker-compose up -d```

7. optional: to get an admin view of the db, follow the setup in this article, starting from "create a server in pgAdmin" https://medium.com/@jewelski/quickly-set-up-a-local-postgres-database-using-docker-5098052a4726

8. start the app. you can go to http://localhost:8000/docs to see the docs.  

    ```uvicorn app.main:app --reload```

