## About the aplication.

Repository to deal with the document injection. Currently, this is in the form of mono repo. Make sure you have node , uv (package manager for python) installed in your system.

# Local development 

## Backend

```bash
git clone https://github.com/asifrahaman13/police_report.git
```

Now set up virtual environment

```bash
cd police_report/
uv venv
source .venv/bin/activate
```

Next install the dependencies.

```bash
uv sync
```

Create a .env file from the .env.example file

```bash
mv .env.example .env
```

Next enter your AWS credentials. Ensure you enter correct access keys as well as the regions.

Now you should be able to run the application.

```bash
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=
```

Now you can run the main  script scripts/main.py to check the functions.
```bash
uv run uvicorn src.main:app --reload
```

## Formatting

For linting run the following:

```bash
ruff check --fix
```

For formatting run the following script:

```bash
ruff format
```


## Front end

Go to the front end directory

```bash
cd frontend/
```

Now install the dependencies.

```bash
bun install
```

Create a .env file from the .env.example file and ensure you enter the correct credentials.

```bash
mv .env.example .env
```

Next run the server in local environment.

```bash
bun run dev
```

# Run as Docker script

A good way to run the application is using the docker container. 
First make sure you exported the AWS credentials.

```bash
docker compose up
```


## Ports

The frontend of the application will run on port 3000. `http://127.0.0.1:3000`

The backend of the application will run on port 8000 `http://127.0.0.1:8000`