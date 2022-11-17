# remix-dashboard-template

A template to get you up and building a dashboard in Remix.

## Getting started with the template

```sh
npx create-remix@latest --install --typescript --template jacob-ebey/remix-dashboard-template
```

You will have the option of:

- No DB using a mock service
- Prisma with SQLite
- Prisma with PostgreSQL

## Development

### docker-compose

If you have chosen to use PostgreSQL, a docker-compose.yml will have been created in the root of your project. You can start the database by running:

```sh
docker-compose up -d
```

You will have to run a migration against the DB if it's the first time running the project. See the below section on [Migrations](#migrations).

```sh
npx prisma migrate dev
```

### Migrations

You can apply migrations to your development database by running:

```sh
npx prisma migrate dev
```

### Running the app

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

## Resources

- [Remix Docs](https://remix.run/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
