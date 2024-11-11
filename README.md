# Travel BI

Travel BI is an app that query a Redshift database to extract data and generate data visualizations like tables, and different kinds of chats like pies, bars, lines and maps to transform the data into something readable and with value for the users.

The application uses a PostgreSQL DB to handle the authentication.

## Stack
- Nuxt
- VueJs
- HighchartsJs
- DataTables
- Prisma
- PostgreSQL
- AWS Redshift

## Setup

### .env File
From **.env.example** file, create a **.env** file in the root directory and fill all the variables according your environment. For **NUXT_AUTH_TOKEN** variable you can use a tool like https://it-tools.tech/token-generator.

### Dependencies
Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Prisma

Make sure create the PostgreSQL database and update the **DATABASE_URL** parameter in the **.env** file and then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```
