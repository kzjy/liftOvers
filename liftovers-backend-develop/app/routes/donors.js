const express = require('express')
const router = express.Router()
const donor = require('../controllers/donor')



//Handle updating of volunteer info
router.patch('/edit', donor.editDonorInfo)

//Get all donors
router.get("/", (req, res) => {
    console.log(req)
    donor.findAll(req, res)
})
