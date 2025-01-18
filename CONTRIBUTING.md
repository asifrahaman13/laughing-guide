## CONTRIBUTING GUIDELINES

Thanks for opting to contribute to this repository. Please go through the following instructions to contribute. Make sure you have python, go, node, docker etc installed in your system.

## AI

Go to the ai directory.

```bash
cd ai/
```

Now set up virtual environment

```bash
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

Now you can run the main script scripts/main.py to check the functions.

```bash
uv run uvicorn src.main:app --reload --port 8080
```

## Backend

```bash
git clone https://github.com/asifrahaman13/laughing-guide.git
```

Go to the root folder.

```bash
cd laughing-guide/
```

Create a .env file from the .env.example file.

```bash
mv .env.example .env
```

Next, enter your credentials. Ensure you enter the correct access keys as well as the regions.Now, you should be able to run the application.

```bash
go build -o myapp && ./myapp
```

## Front end

Go to the front-end directory

```bash
cd frontend/
```

Create a .env file from the .env.example file.

```bash
mv .env.example .env
```

Now install the dependencies.

```bash
bun install
```

Next, run the server in the local environment.

```bash
bun run dev
```

## Formatter

The golang files can be formatted using the following command:

```bash
go fmt src/
```

The frontend can be formatte by the following:

```bash
cd frontend/
bun run format
```

For the ai it can be done by:

```bash
cd ai/
ruff format
```

## Docker

To run the application in docker, use the following script after making sure you have the .env credentials for both front end, backend as well as the AI stack.

```bash
docker compose up
```

## Ports

- Ai will run on port `8080`
- The backend port will run on port `8000`
- Frontend will run on port `3000`
