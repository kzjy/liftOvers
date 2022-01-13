const express = require('express')
const router = express.Router()
const admins = require('../controllers/admins')

const isAuthenticatedAdmin = (req, res, next) => {
	if(req.user && req.user.role === "admin") {
		next()
	} else {
		res.status(401).send({ msg: "Not an admin, Unauthorized"})
	}
}


// List of incomplete requests for volunteers
router.post('/create', isAuthenticatedAdmin, admins.createAdmin)

// Delete a specfic lift
router.delete('/lifts/delete', isAuthenticatedAdmin, admins.removeLift)

// Delete a specfic donors
router.delete('/donors/delete', isAuthenticatedAdmin, admins.removeDonor)

// Delete a specfic volunteers
router.delete('/volunteers/delete', isAuthenticatedAdmin, admins.removeVolunteer)

// Delete a specfic food banks
router.delete('/foodbanks/delete', isAuthenticatedAdmin, admins.removeFoodBank)

// Get list of lift requests
router.get('/lifts', isAuthenticatedAdmin, admins.getLifts)

// Get lift detail
router.get('/liftDetail', isAuthenticatedAdmin, admins.getLiftDetail)

//Request for csv file download for lifts
router.get('/lifts/download', isAuthenticatedAdmin, admins.getLiftsCsvFile)

// Get list of donors
router.get('/donors', isAuthenticatedAdmin, admins.getDonors)

// Get donors csv files
router.get('/donors/download', isAuthenticatedAdmin, admins.getDonorsCsvFile)

// Get specific donor detail
router.get('/donorDetail', isAuthenticatedAdmin, admins.getDonorDetail)

// Get volunteers
router.get("/volunteers", isAuthenticatedAdmin, admins.getVolunteers)

// Get volunteers csv files
router.get("/volunteers/download", isAuthenticatedAdmin, admins.getVolunteersCsvFile)

// Get specific volunteer detail
router.get('/volunteerDetail', isAuthenticatedAdmin, admins.getVolunteerDetail)

// Get all food banks 
router.get('/foodbanks', isAuthenticatedAdmin, admins.getFoodBanks)

// Get food banks csv files 
router.get('/foodbanks/download', isAuthenticatedAdmin, admins.getFoodBanksCsvFile)

// Get completed stats by month
router.get('/totalMonths', admins.getTotalMonths)

// Get completed stats
router.get('/totalCompleted', admins.getTotalCompleted)

// Get canceled stats
router.get('/totalCancelled', admins.getTotalCancelled)

// Get incomplete stats
router.get('/totalIncomplete', admins.getTotalIncomplete)

// Get total volunteers
router.get('/totalVolunteers', admins.getTotalVolunteers)

module.exports = router