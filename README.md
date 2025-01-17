# Blazing fast HR payroll system.⚡⚡

A blazing-fast HR payroll system designed to deal with simplicity as well as blazing-fast speed. The application is capable of handling thousands of files concurrently, making it extremely efficient for the HR payroll system.



![Screenshot from 2025-01-16 01-29-49](https://github.com/user-attachments/assets/bc9b7379-8bec-4a15-9058-032965d83768)
![Screenshot from 2025-01-16 01-28-32](https://github.com/user-attachments/assets/e9adb2d6-3696-4095-a5b6-361dbc09489d)
![Screenshot from 2025-01-16 01-30-09](https://github.com/user-attachments/assets/3a86ee72-1188-4f41-ba60-c1c3893e4a90)
![Screenshot from 2025-01-16 01-28-52](https://github.com/user-attachments/assets/317c44f0-116d-459f-8717-77898b3038a2)


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

## Docker

To run the application in docker, use the following script after making sure you have the .env credentials for both front end and backend:

```bash
docker compose up
```

## Ports

The backend port will run on port `8000` and the frontend will run on port `3000`
