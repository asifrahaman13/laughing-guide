# HR Payroll system

Repository to deal with HR payroll system

![Screenshot from 2025-01-14 22-43-20](https://github.com/user-attachments/assets/2b1d1847-37ba-4afd-aa1a-de9a2b2aed0c)


## Backend

```bash
git clone https://github.com/asifrahaman13/laughing-guide.git
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

Now you can run the main script scripts/main.py to check the functions.

```bash
go run main.go
```

## Front end

Go to the front end directory

```bash
cd frontend/
```

Create a .env file from the .env.example file

```bash
mv .env.example .env
```

Now install the dependencies.

```bash
bun install
```

Next run the server in local environment.

```bash
bun run dev
```

## Docker

To run the application in docker use the following script after making sure you have the .env credentials for both front end and backend:

```bash
docker compose up
```

## Ports

The backend port will run on port `8000` and the frontend will run on port `3000`
