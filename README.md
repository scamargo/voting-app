# Voting App for Reddit

## Overview

Voting app built with Clementine.js using MongoDB, Express and Node.js, and [Passport](http://passportjs.org/).


# Quick Start Guide

### Prerequisites

In order to use Clementine.js, you must have the following installed:

- [Node.js](https://nodejs.org/)
- [NPM](https://nodejs.org/)
- [MongoDB](http://www.mongodb.org/)
- [Git](https://git-scm.com/)

## Installation & Startup

### Setup Reddit Authentication

Please follow [this guide](https://github.com/reddit/reddit/wiki/OAuth2) to register the application with Reddit and get API keys / secrets.

### Local Environment Variables

Create a file named `.env` in the root directory. This file should contain:

```
REDDIT_KEY=your-client-id-here
REDDIT_SECRET=your-client-secret-here
MONGO_URI=mongodb://localhost:27017/voting-app-db
PORT=8080
APP_URL=http://localhost:8080/
```

### Starting the App

To start the app, make sure you're in the project directory and type `node server.js` into the terminal. This will start the Node server and connect to MongoDB. (make sure you have started the mongo database)

You should the following messages within the terminal window:

```
Debugger listening on port 15454
Node.js listening on port 8080...
```

Next, open your browser and enter `http://localhost:8080/`. Congrats, you're up and running!

### c9.io Setup

If you're using c9.io, please [reference the documentation](http://www.clementinejs.com/versions/fcc.html#c9.ioSetup) for instructions to get Clementine.js working in the c9 environment.

## Contributing

This is an open-source project, and contributions are always welcome!

## License

MIT License. [Click here for more information.](LICENSE.md)
