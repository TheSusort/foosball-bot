import { Router } from 'express'
/**
 * Handles all requests related to scores1
 */
const router = Router()
let score = 0
export default router
/**
 * Add new score
 * @param {String} req.body.text : Slack sends everything after slash command as a text string
 */
const addScore = (req, res) => {
    score = req.body.text.trim()
// Create payload for Slack API
    const payload = { "text": "Score has been added!" }
// Send back payload to Slack
    return res.status(200).json(payload)
}
/**
 * Get score
 */
const getScore = (req, res) => {
// Create payload for Slack API
    const payload = {
        "response_type": "in_channel",
        "text": "Highscore: " + score,
        "attachments": [
            {
                "text": "Such a high score, wow!"
            }
        ]
    }
// Send back payload to Slack
    return res.status(200).json(payload)
}
router.route('/getScore')
    .post(getScore)
router.route('/add')
    .post(addScore)