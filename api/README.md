# MOVIES API

## Description
It is a REST API for a movie rental business that creates, lists, and updates users, clients, movie loans, and movie copies.

## ERD

![ERD_MovieAPI](https://user-images.githubusercontent.com/61089189/234148639-f889e716-1b7b-4f35-a2a4-3e0f48fd6e65.png)

## Technologies and programming languages

* **TypeScript** (v. 4.9.4) [Source](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
* **Express** (v. 4.18.2)  [Source](https://www.npmjs.com/package/express)
* **Prisma** (v. 4.9.0) [Source](https://www.prisma.io/docs)
* **nodemon** (v. 2.0.20) [Source](https://www.npmjs.com/package/nodemon)
* **cors** (v. 2.8.5) [Source](https://www.npmjs.com/package/cors)
* **dotenv** (v. 16.0.3) [Source](https://www.npmjs.com/package/dotenv)
* **jsonwebtoken** (v. 9.0.0) [Source](https://www.npmjs.com/package/jsonwebtoken)
* **concurently**  (v. 7.6.0) [Source](https://www.npmjs.com/package/concurrently)
* **ts-node**  (v. 10.9.1) [Source](https://www.npmjs.com/package/ts-node)
* **tslib**  (v. 2.4.1) [Source](https://www.npmjs.com/package/tslib)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`PORT`

`JWT_SECRET`

## Run Locally

Clone the project

```bash
  git clone https://github.com/Geffrerson7/APP-MOVIES.git
```

Go to the project directory

```bash
  cd APP-MOVIES
```

Install dependencies

```bash
  npm install
```

Make migrations

```bash
  npx prisma migrate dev
```

Run project

```bash
  npm run dev
```

## API Documentation

[Postman documentation link](https://documenter.getpostman.com/view/24256278/2s93JxrgVh) 

## Author

- [Gefferson Casasola](https://github.com/Geffrerson7)
