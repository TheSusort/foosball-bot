# foosball-bot
foosball bot for slack integration

## Setup
You need some env variables to get it up and running.

For the client: 
```
// These are urls for requests to backend (eg: https://us-centralx-app-name.cloudfunctions.net/app/)
REACT_APP_API_URL_LIVE=
REACT_APP_API_URL_TEST=
```


For the backend:
```
// used for switching between dev and prod mode 0/1
DEVELOPMENT_MODE=

// slack bot prod
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_CHANNEL_ID=

// slack bot dev
SLACK_BOT_TOKEN_TEST=
SLACK_SIGNING_SECRET_TEST=
SLACK_CHANNEL_ID_TEST=

// db url
FIREBASE_DB_URL=
FIREBASE_DB_URL_TEST=

// api key for giphy
GIPHY_API_KEY=
```

## Running it

Frontend and backend are run separatly. For the backend:
```
cd functions
npm install
npm serve

//then set up ngrok to run on the port for functions and use ngrok url for REACT_APP_API_URL_TEST
ngrok http 5001
```
For the frontend:
```
cd client
npm install
npm start
