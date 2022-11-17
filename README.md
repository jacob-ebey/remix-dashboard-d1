# remix-dashboard-template

A template to get you up and building a dashboard in Remix that runs solely on Cloudflare.

## Development

### Migrations

You can apply migrations to your development database by running:

```sh
npx prisma migrate dev
```

### Running the app

Start the Remix development asset server and Wrangler by running:

```sh
npm run dev
```

This starts your app in development mode.

## Deployment

Create a database:

```sh
wrangler d1 create remix-dashboard-d1-example-db
```

Apply migrations:

```sh
wrangler d1 migrations apply remix-dashboard-d1-example-db
```

Build and deploy:

```sh
npm run build && npx wrangler publish
```

## Resources

- [Remix Docs](https://remix.run/docs)
- [CF D1](https://developers.cloudflare.com/d1/)
- [Prisma Docs](https://www.prisma.io/docs/) (only used for generating migrations)
