# Storefront Backend Project

> An online store REST API back-end built with Typescript, Node.js, Express and Postgres. The project demonstrates how to architect the database, its tables and columns to fulfill the data requirements and craft a RESTful API that exposes that information to a frontend app.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/200px-Node.js_logo.svg.png)
![](https://upload.wikimedia.org/wikipedia/commons/7/79/Docker_%28container_engine%29_logo.png)

![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

This app showcases an online store REST API powered by Typescript, Node.js, Express and Postgres to make product ideas available for purchase on the internet.

## Installation

### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

### Installing Docker
Docker is required to host and serve the postgres. Instructions for setting up Docker can be found from [https://www.docker.com/get-started](https://www.docker.com/get-started).

### Cloning the project

Clone the source locally:

```sh
$ git clone https://github.com/thepembeweb/storefront-api.git
$ cd storefront-api
```

### Set up Environment variables 

Clone the source locally:

1.Create a `.env` file in the project root directory
2.Setup the following env variables
```
NODE_ENV=development
POSTGRES_HOST=<postgress db instance hostname e.g 127.0.0.1>
POSTGRES_PORT=<postgress db instance hostname port e.g 5433>
POSTGRES_PORT_TEST=<postgress test db instance hostname port e.g 5434>
POSTGRES_DB=<postgress db name>storefront_dev
POSTGRES_DB_TEST=<postgress test db name>storefront_test
POSTGRES_USER=<postgress db username>
POSTGRES_PASSWORD=<postgress db password>
BCRYPT_PASSWORD=<bcrypt password>
SALT_ROUNDS=<salt rounds e.g 10>
JWT_SECRET=<secret string for encrypting app passwords>
```

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:
```sh
npm install
```
>_tip_: **npm i** is shorthand for **npm install**

Analyze the code to find potential bugs:

```sh
$ npm run lint
```
Run tests on the code:

```sh
$ npm run test
```
Create Postgres DB with Docker:

```sh
$ docker-compose up -d
```
Create DB with Migrations:

```sh
$ npm run migrate:up
```
Start the app:

```sh
$ npm run serve
```
Open your browser and visit the below url to view the message "Storefront API" id the api setup ran successfully:

```sh
http://localhost:3000
```
You can use [Postman](https://www.postman.com/) to test the API Endpoints as defined in the [REQUIREMENTS.md](REQUIREMENTS.md) file.


## Built With

* [Node.js®](https://nodejs.org/) - The JavaScript runtime used
* [Express.js®](https://nodejs.org/) - The web application framework used
* [Typescript](https://www.typescriptlang.org/) - The Programming Language used
* [Postgres](https://www.postgresql.org/) - The Database used


## Authors

* **[Pemberai Sweto](https://github.com/thepembeweb)** - *Initial work* - [Storefront API](https://github.com/thepembeweb/storefront-api)


## License

[![License](http://img.shields.io/:license-mit-green.svg?style=flat-square)](http://badges.mit-license.org)

- This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
- Copyright 2021 © [Pemberai Sweto](https://github.com/thepembeweb).
