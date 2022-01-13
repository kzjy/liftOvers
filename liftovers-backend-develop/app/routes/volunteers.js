const express = require('express')
const router = express.Router()
const volunteer = require('../controllers/volunteer')

const isAuthenticated = (req, res, next) => {
	console.log(req.user)
	if(req.user) {
		next()
	} else {
		res.status(401).send({ msg: "Unauthorized"})
	}
}

// Get volunteer profile
router.get('/profile', volunteer.getProfile)

//Handle updating of volunteer info
router.patch('/edit', volunteer.editVolunteerInfo)

// Get volunteer past lifts
router.get('/record', isAuthenticated, volunteer.getPastLifts)

// Get volunteer current lifts 
router.get('/current', isAuthenticated, volunteer.getCurrentLifts)

module.exports = router