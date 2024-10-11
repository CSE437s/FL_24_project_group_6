# Project Name: Caret: Commenting on the Internet (Chrome Extension)

### Team members: Noah Gluck, Sophie Schochet, Sourav Mahanty, Ritika Tejwani

### TA: <Insert Here>

### Instructions/Link to access: <insert here>

### BACKEND STEPS

in terminal `cd backend`

Initial Setup for backend:

1. make sure you're using python 3.10+
2. create a venv in /backend:

   `python3 -m venv .venv`

3. activate the venv in /backend

   `source .venv/bin/activate`

4. install the dependencies in /backend

   `pip3 install -r requirements.txt`

5. start the postgres container in /backend

   `docker-compose up -d`

6. start the app. you can go to http://localhost:8000/docs to see the docs.  
   uvicorn app.main:app --reload
   ```

   ```

If you already have everything installed:

`docker-compose up -d`

`uvicorn app.main:app --reload`

### FRONTEND STEPS

open another terminal and `cd caret`

Initial setup for frontend:
`npm i`

if everything is installed:

`npm run dev`

### USE EXTENSION

1. Open Chrome and go to chrome://extensions/
2. Turn on Developer mode top right
3. Click "Load Unpacked"
4. Select extension folder
5. Click extension to make sure it loads and works
