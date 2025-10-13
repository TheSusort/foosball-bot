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

Frontend and backend are run separately. For the backend:
```bash
cd functions
npm install
npm run serve

# Then set up ngrok to run on the port for functions and use ngrok url for REACT_APP_API_URL_TEST
ngrok http 5001
```
For the frontend:
```bash
cd client
npm install
npm run dev
```

## API Endpoints

### POST /manual-match
Register a match manually without going through the Slack game flow. Useful for retroactively adding games or integrating with external scoring systems.

**Request Body:**
```json
{
  "team1": ["USER_ID_1", "USER_ID_2"],
  "team2": ["USER_ID_3", "USER_ID_4"],
  "score": "10 5"
}
```

**Parameters:**
- `team1` (array of strings, required): Array of Slack user IDs for team 1. Can be 1 or 2 players.
- `team2` (array of strings, required): Array of Slack user IDs for team 2. Can be 1 or 2 players.
- `score` (string, required): Final score in format "X Y" where X is team1's score and Y is team2's score. One team must have 10 points.

**Validation Rules:**
- Both teams must have at least 1 player
- Score must be in format "X Y" (space-separated)
- One team must have exactly 10 points (winning score)
- Scores must be between 0 and 10
- No ties allowed
- A player cannot be on both teams
- All user IDs must exist in the database

**Example Success Response:**
```json
{
  "success": true,
  "message": "Match registered successfully",
  "result": "10 5"
}
```

**Example Error Response:**
```json
{
  "error": "Score must be in format '10 5'"
}
```

**Example cURL:**
```bash
curl -X POST https://your-api-url.com/manual-match \
  -H "Content-Type: application/json" \
  -d '{
    "team1": ["U123ABC", "U456DEF"],
    "team2": ["U789GHI"],
    "score": "10 7"
  }'
```

### POST /scoreblue
Increment blue team's score by 1. Triggers game completion when 10 points reached.

**Rate Limit:** 1 request per 3 seconds per IP

**Response:** Current score string (e.g., "5 - 3" or "BLUE TEAM WON")

### POST /scorered
Increment red team's score by 1. Triggers game completion when 10 points reached.

**Rate Limit:** 1 request per 3 seconds per IP

**Response:** Current score string (e.g., "3 - 7" or "RED TEAM WON")

### GET /getusers
Get all users or a specific user's data.

**Rate Limit:** 1 request per 5 seconds per IP

**Query Parameters:**
- `userid` (optional): Slack user ID to get specific user

**Example:**
```bash
# Get all users
curl https://your-api-url.com/getusers

# Get specific user
curl https://your-api-url.com/getusers?userid=U123ABC
```

### GET /getgames
Get all completed games.

**Rate Limit:** 1 request per 5 seconds per IP

### GET /getcurrentgame
Get the currently active game details (teams and players).

**Rate Limit:** 1 request per 5 seconds per IP

### GET /getcurrentscore
Get the current score of the active game.

**Rate Limit:** 1 request per 5 seconds per IP

### GET /getemojis
Get all custom Slack emojis for the workspace.

### GET /getbotid
Get the bot's Slack user ID.

## Slack Commands

When a game is started in Slack, the following commands are available:

- `start` - Start a new 2v2 game
- `start single` - Start a new game as a solo player (2v1 or 1v1)
- `join` - Join the current pending game
- `join single` - Join as a solo player
- `force start` - Force start the game with current players (initiator becomes solo player)
- `stop` - Cancel the current game
- `status` - Show current game status
- `bet [team] [amount]` - Place a bet on a team (blue/red)
- `wallet` - Check your coin balance
- `help` - Show help message

## Game Modes

- **2v2**: Standard 4-player game
- **2v1**: Three players, one solo vs duo team
- **1v1**: Two players, head-to-head

## ELO Rating System

Players start at 1000 rating. Ratings are adjusted after each game based on:
- Expected outcome (based on team rating difference)
- Actual outcome (win/loss)
- Team composition (solo players get adjusted calculations)

## Betting System

Players can bet coins on game outcomes before the first point is scored. Odds are calculated based on:
- Team average ELO ratings
- Historical solo player performance (for 2v1 games)
- Odds are clamped between 0.05 and 0.95 to prevent extreme payouts

Players earn 100 coins for participating in games.
