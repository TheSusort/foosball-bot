import express from 'express'
import bodyParser from 'body-parser'
import scoreRouter from './routes/score'
/* Initialize app and configure bodyParser */
const port = process.env.PORT || 3005
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/* API Routes */
app.use('/score', scoreRouter)
/* API Test Route */
app.get('/', (req, res) => {
res.send('App is running correctly!')
})
/* CORS */
app.use((req, res, next) => {
// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
// Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type')
// Pass to next layer of middleware
    next()
});
/* Serve API */
app.listen(port, () => {
    console.log('Slack Bot listening on port 3005!')
})