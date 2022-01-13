const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const FoodBank = require('../models/foodbank')


// Index page
router.get('/', (req, res) => {
	res.send('hello')
})

router.get('/dashboard', (req, res) => {
	res.send('this is the dashboard')
})

// Handle login request 
router.post('/login', auth.login)

// Handle logout request 
router.get('/logout', auth.logout)

// Handle register request
router.post('/register', auth.register)

router.get('/verify', (req, res) => {
	console.log(req.user)
	if(req.user) {
		res.send(req.user)
	} else {
		res.status(401).send(null)
	}
})

// add food bank
router.post('/addFoodBank', (req, res) => {
	const foodBank = new FoodBank({
		agency: req.body.agency,
		address: req.body.address,
		contact: req.body.contact,
		phone: req.body.phone,
		email: req.body.email
	})

	foodBank.save().then(result => {
		console.log(result)
		res.send(result)
	})
})

module.exports = router