# wheredidmytimego
As a freelance developer I often don't track my time well enough working on projects. There are more than enough products out there to track my time. But I'm a developer, so why not build it myself?


## Frontend
I used Nextjs as frontend framework together with RTK-query for querying and caching data and Mantine for easy to use components. Run the frontend locally with:
```zsh
cd app/
npm install
npm run dev
```

## Backend
Dotnet together with entity framework core were my choice for the backend. I'm using a Postgres database for persisting the data. 
To run the backend make sure you have a database up and running. I'm using Docker to run the database. 

To run the Postgres database with Docker make sure you have the Docker engine (or desktop app) installed. The docker-compose needs a username and password to start the container. Create an .env file in the root of the project and fill in your own values.
```.env
POSTGRES_USER=
POSTGRES_PASSWORD=
```

And then run the container.
```zsh
docker-compose up -d
```

Now that the database is up put the credentials for the created Postgres user in the connection string found in `api/appsettings.Development.json`

Run the backend by building the project and running it.

```zsh
cd api/
dotnet build
dotnet run
```

Happy freelancing!

## Todo
- [ ] Project timeframes export to .csv or .pdf
- [ ] Timeframe filter preset options
- [ ] Analytics 
