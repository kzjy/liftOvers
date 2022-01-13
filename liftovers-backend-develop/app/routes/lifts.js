const express = require('express')
const router = express.Router()
const lifts = require('../controllers/lifts')

const isAuthenticated = (req, res, next) => {
	if(req.user) {
		next()
	} else {
		res.status(401).send({ msg: "Unauthorized, You must be logged in."})
	}
}

// Index page
router.get('/', (req, res) => {
	res.send('lifts page')
})

// Request lift
router.post('/request', lifts.requestLift)

// Request for sms communication 
router.post('/sms', lifts.parseText)

// List of incomplete requests for volunteers
router.get('/available', isAuthenticated, lifts.getAvailableLifts)

module.exports = router