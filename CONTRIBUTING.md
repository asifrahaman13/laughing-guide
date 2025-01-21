## CONTRIBUTING GUIDELINES

Thanks for opting to contribute to this repository. Please go through the following instructions to contribute. Make sure you have python, go, node, docker etc installed in your system.

Make sure you are running vector database. Either you can use their service or you can use it locally.

```bash
docker pull qdrant/qdrant
```

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
qdrant/qdrant
```

You should be able to see your collections here: `http://localhost:6333/dashboard#/collections`

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
gofmt -w .
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

First make sure you have the build file in your root. If not present create the same.

```bash
go build -o myapp
```

Now spin up your docker containers.

```bash
docker compose up
```

## Ports

- Ai will run on port `8080`
- The backend port will run on port `8000`
- Frontend will run on port `3000`
