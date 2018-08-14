# aws-lambda-dynamo

[![CircleCI](https://circleci.com/gh/moroine/aws-lambda-dynamo/tree/master.svg?style=svg)](https://circleci.com/gh/moroine/aws-lambda-dynamo/tree/master)

This is a sample template for aws-lambda-dynamo - Below is a brief explanation of what we have generated for you:

```bash
.
├── README.md                   <-- This instructions file
├── build                       <-- Source code for a lambda function
│   ├── index.js                <-- Lambda function code
│   ├── package.json            <-- NodeJS dependencies to be installed in production
├── src                         <-- Src code
│   └── index.js                <-- Entry point
│   └── api                     <-- api endpoints
│   └── model                   <-- data model
│   └── repositories            <-- functions to interact with the database
├── tests                       <-- Unit tests
└── template.yaml               <-- SAM template
```

## Requirements

* AWS CLI already configured with at least PowerUser permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/)
* [Docker installed](https://www.docker.com/community-edition)

## Setup process

### Installing dependencies

```bash
yarn install
```

### Local development

**Run the local server**

```bash
yarn start
```

**In another terminal, start watching files**
```bash
yarn run build:dev
```

**In another terminal, distribute local dev server**
```bash
http-server -c-1 public -p8080
```

**In another terminal, bootstrap local database**
```bash
./local/bootstrapLocalDynamoDb.sh
```

If previous commands ran successfully you should now be able to hit the following local endpoint to invoke your function `http://localhost:8080?endpoint=http://localhost:3000`

Default admin is:

- email: `admin@mail.com`
- password: `pass`

## Packaging and deployment

The project is continuously delivered from master branch and deployed to [https://aws-lambda-dynamo-platform.s3.amazonaws.com/index.html](https://aws-lambda-dynamo-platform.s3.amazonaws.com/index.html)

## Testing

```bash
yarn lint
yarn test
```

## Limitations

- [ ] CORS security issue
- [ ] No email verification, and password is managed by admin
