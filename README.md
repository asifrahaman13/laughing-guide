# Blazing fast HR payroll system.⚡⚡

A blazing-fast HR payroll system designed to deal with simplicity as well as blazing-fast speed. The application is capable of handling thousands of files concurrently, making it extremely efficient for the HR payroll system.

![Screenshot from 2025-01-15 01-37-53](https://github.com/user-attachments/assets/0a4e3475-55bc-45da-a62c-aa1dac7dc3c0)

## Backend

```bash
git clone https://github.com/asifrahaman13/laughing-guide.git
```

Create a .env file from the .env.example file.

```bash
mv .env.example .env
```

Next, enter your AWS credentials. Ensure you enter the correct access keys as well as the regions.Now, you should be able to run the application.


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

## Docker

To run the application in docker, use the following script after making sure you have the .env credentials for both front end and backend:

```bash
docker compose up
```

## Ports

The backend port will run on port `8000` and the frontend will run on port `3000`
