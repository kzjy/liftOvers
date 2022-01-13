const Lift = require('../models/lifts.js');
const util = require('./util')
const Volunteer = require('../models/volunteer.js')
const FoodBank = require('../models/foodbank.js')
const Donor = require('../models/donors')
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD_LPYQsjwLnEh1fcK74vSsytYgvWHndZQ'
});


/*
List of functions to add changes to:
        - createLift: notify user profile that there is lift request happening
        - setLiftVolunteer: notify user profile that you accepted a lift (lift details)
        - cancelLift: notify user profile that liftRequester canceled the request

    Optional:
        - completeLift: notify user profile to congratulate him/her for completing the request
        - declineLift: notify user profile that there is always next time.
        - cannotComplete: notify donor profile that the request cannot be copleted.
*/

/*
Create and save a new lift 
Called by requestLift
*/
exports.createLift = (reqDonor, availability, description, res) => {
    let newLift = new Lift({
        availability: availability,
        description: description,
    })
    let banks = []
    let index = 0
    Donor.findOne({ "email": reqDonor.email})
    .then(result => {
        newLift['donor'] = result._id
    })
    .then(() => {
        return FoodBank.find({})
    })
    .then(result => {
        banks = result
        let promiseList = []
        result.map(bank => {
            promiseList.push(util.getDistance(bank.address, result.address))
        })
        return Promise.all(promiseList)
    })
    .then(result => {
        let minDist = 999999999
        
        result.map(response => {
            const elements = response.data.rows[0].elements[0]
            if (elements.status === 'NOT_FOUND' || !elements.distance || !elements.distance.value) {
                console.log('Cannot find address')
            } else {
                const dist = elements.distance.value
                minDist = (minDist > dist) ? dist : minDist
                index = result.indexOf(response)
            }
        })
        console.log(minDist, index)
        console.log(banks[index])
        newLift['destination'] = banks[index]._id
        return newLift.save()
    })
    .then(() => {
        return Donor.findOneAndUpdate({ "email": reqDonor.email}, { "lastSubmittedRequest": newLift._id})
    })
    .then(() => {
        res.send({ message: 'Succesfully requested lift', donorId: `${newLift._id}`, description: `${newLift.description}`})
        util.alertAvailableVolunteers(newLift, reqDonor.address, banks[index])
        util.sendConfirmationDonor(reqDonor.firstName, reqDonor.phone, newLift, banks[index])
    })
    .catch(err => {
        console.log(err)
        res.send({ message: 'An error has occured, please try again'})
    })
}


/*
Handles lift request
Sample request format: 
{
    "donor": {
		"firstName": "John",
		"lastName": "Doe",
		"email": "john@doe.com",
		"phone": "123456789",
		"address": "123 Chesnut St Toronto",
	},
	
	"availability": {
		"date": {
			"year": 2019,
			"month": 11,
			"day": 11
		},
		"time": {
			"hour": 12,
			"minute": 9
		}
    },
    
	"description": "Some description"
}
*/
exports.requestLift = (req, res) => {

    // Check if required fields are present
    const {donor, availability, description} = req.body
    if (!donor || !availability || !description) {
        res.status(400).send({ message: 'Fill in the required fields'})
    } 

    if (!donor.firstName || !donor.lastName || !donor.phone || !donor.email || !donor.address) {
        res.status(400).send({ message: 'Missing field in donor'})
    }

    const reqDonor = {
        "firstName": donor.firstName,
        "lastName": donor.lastName,
        "email": donor.email,
        "phone": donor.phone,
        "address": donor.address,
        "contactPreference": donor.contactPreference
    }

    // Find update in db, create one of its a new doner, identify by email
    Donor.update({ "email": donor.email}, reqDonor, { upsert : true }).then(result => {
        this.createLift(reqDonor, availability, description, res)
    })
    // res.send("Ok")
}

/*
Assign volunteer to lift
Called by acceptLift
*/
exports.setLiftVolunteer = (res, lift, volunteer, fromWeb) => {
    console.log('Setting lift volunteer')
    Lift.findOneAndUpdate({ "_id": lift._id}, { "hasVolunteer": true, "volunteer": volunteer._id})
        .then(l => {
            Donor.findOne({ "_id": lift.donor})
                .then(donor => {
                    if (!donor) {
                        res.status(500).send({msg: "An error has occured"})
                        return
                    }
                    Volunteer.findOneAndUpdate({"_id": volunteer._id}, {"lastAcceptedRequest": l._id})
                        .then(v => {
                            if (fromWeb) {
                                // Request is accepted on the website
                                console.log('Accept request from web')
                                util.sendConfirmationVolunteer(volunteer.phone, donor, lift)
                                util.sendConfirmation(donor.phone, lift.availability, volunteer)
                                res.send({msg: "Sucessfully accepted request"})
                                return
                            } else {
                                // Request is accepted through sms
                                console.log('Accept request from sms')
                                const a = lift.availability
                                const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 9) ? a.time.minute : `0${a.time.minute}`}`
                                util.replyText(res, `Thank you, you have been confirmed to pick up the food item on ${dateString}. The donor can be contacted at ${donor.phone} in case of any last minute changes. Reply CANNOT COMPLETE if you cannot make it.` )
                                util.sendConfirmation(donor.phone, lift.availability, volunteer)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).send({msg: "An error has occured"})
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).send({msg: "An error has occured"})
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({msg: "An error has occured"})
        })
}


/*
Accept a lift request: 
Called by parseText
*/
exports.acceptLift = (req, res) => {
    const phone = req.body.From.slice(2)
    // Check if it has already been accepted
    Volunteer.findOne({ "phone": phone}).then(volunteer => {
        if (!volunteer) {
            res.status(404).send({msg: "No volunteer is associated with that phone number"})
            return
        }

        // Request is sent from frontend website
        if (req.body._id) {
            Lift.findOne({ "_id": req.body._id}).then(lift => {
                if (lift.hasVolunteer) {
                    // Already has a volunteer
                    res.send({msg: "This request already has a volunteer"})
                } else {
                    // Update lift to have a volunteer
                    this.setLiftVolunteer(res, lift, volunteer, true)
                    // Send confirmation text 
                }
            })
            return
        }

        // Request is sent from twilio
        Lift.findOne({ "_id": volunteer.lastReceivedRequest}).then(lift => {
            if (lift.hasVolunteer) {
                // Already has a volunteer
                // Send text saying already accepted
                util.replyText(res, `Thank you but there is already a volunteer on the job `)
            } else {
                // Update lift to have a volunteer
                this.setLiftVolunteer(res, lift, volunteer, false)
                // Send confirmation text 
                
            }
        })
    })
}

/*
Handle volunteer declining lift
Called by parseText
*/
exports.declineLift = (req, res) => {
    console.log('Declined')
    util.replyText(res, 'Thank you for your response, there is always next time !')
}

/*
Parse incoming sms, calling diff functions
Sample request format: 
{
    "Body": //yes to accept//no to decline//cancel lift to cancel from donor//cannot complete to cancel from volunteer//complete to complete lift//everything else is error
    "From": "+16231232323" // Phone number of volunteer

    // If making request from web, include lift_id of which one to accept
    "_id": "some id"
}
*/
exports.parseText = (req, res) => {
    if (!req.body.Body || !req.body.From) {
        res.status(400).send({msg: 'Missing Body or From'})
        return
    }
    
    const msg = req.body.Body.toLowerCase()
    phone = req.body.From.slice(2)
    console.log(msg)
    switch (msg) {
        case "yes": 
            this.acceptLift(req, res)
            break;
        case "no":
            this.declineLift(req, res)
            break;
        case "cancel lift":
            this.cancelLift(req, res)
            break;
        case "complete":
            this.completeLift(req, res)
            break;
        case "cannot complete":
            this.cancelLiftVolunteer(req, res)
            break;
        default:
            this.errorText(req, res)
            break;
    }
}

/*
Respond to sms that cannot be understood
Called by parseText
*/
exports.errorText = (req, res) => {
    util.replyText(res, "Sorry that reply cannot be understood.")
}

/*
Handle marking lift as complete
Called by parseText
*/
exports.completeLift = (req, res) => {
    const phone = req.body.From.slice(2)
    Volunteer.findOne({ "phone": phone}, err => console.log(err))
        .then(volunteer => {
            if (!volunteer) {
                res.send(404).send({msg: "Volunteer cannot be found"})
            }
            Lift.findOneAndUpdate({"volunteer": volunteer._id, "status": "Incomplete"}, {"status": "Complete"}, err => console.log(err))
                .then(lift => {
                    if (!lift) {
                        res.send(404).send({msg: "Lift cannot be found"})
                    }
                    Donor.findOne({ "_id": lift.donor}, err => console.log(err))
                        .then(donor => {
                            if (!volunteer) {
                                res.send(404).send({msg: "Donor cannot be found"})
                            }
                            // Send confirmation sms to donor
                            util.sendCompleteConfirmation(donor.phone, volunteer)
                            // Reply to volunteer 
                            util.replyText(res, "Your lift has been marked complete. Thank you! ")
                        })
                        .catch(err => {

                        })
                    
                })
        })
        .catch(err => console.log(err))
}

/*
Handle lift cancellation by volunteer
Called by parseText
*/
exports.cancelLiftVolunteer = (req, res) => {
    const phone = req.body.From.slice(2)
    Volunteer.aggregate([ {$lookup: {from: 'lifts', localField: '_id', 'foreignField': 'volunteer', as: 'liftDetails'}}, {$match: {"phone": phone}}])
        .then(volunteer => {
            if (volunteer.length === 0) {
                res.status(400).send({msg: "Cannot find volunteer"})
                return
            }
            Lift.aggregate([{$lookup: {from: 'donors', localField: 'donor', 'foreignField': '_id', as: 'donorDetails'}}, {$match: {"_id": volunteer[0].lastAcceptedRequest}}])
                .then(lift => {
                    if (lift.length === 0) {
                        res.status(400).send({msg: "Cannot find volunteer"})
                        return
                    }
                    Lift.findOneAndUpdate({"_id": lift[0]._id}, {"status": "Cancelled", "reason": "Cancelled by volunteer"})
                        .then(result => {
                            // Notify donor and volunteer of cancellation
                            console.log(result)
                            util.replyText(res, "Successfuly cancelled")
                            console.log(lift, lift[0].donorDetails[0].phone)
                            util.sendCancellation(lift[0].donorDetails[0].phone, lift[0].availability, false)
                        }) 

                })
        }) 
        .catch(err => {
            console.log(err)
            res.status(500).send({msg: "An error has occured"})
        })
}

/*
Handle lift cancellation by donor
Called by parseText
*/
exports.cancelLift = (req, res) => {
    const phone = req.body.From.slice(2)
    Donor.findOne({ "phone": phone}, err => console.log(err))
        .then(donor => {
            if (donor) {
                Lift.findOneAndUpdate({ "_id": donor.lastSubmittedRequest}, {"status": "Cancelled", "reason": "Cancelled by donor"}, err => console.log(err))
                    .then(lift => {
                        if (lift) {
                            // Send cancel confirmation
                            util.replyText(res, "Successfully cancelled")
                            // Notify volunteer if it has a volunteer 
                            if (lift.hasVolunteer) {
                                console.log('Has volunteer')
                                Volunteer.findOne({ "_id": lift.volunteer}, err => console.log(err))
                                    .then(volunteer => {
                                        console.log('sending msg')
                                        util.sendCancellation(volunteer.phone, lift.availability, true)
                                    })
                            }
                        }
                        
                    })
                    .catch(err => console.log(err))
            } else {
                util.replyText(res, "Cannot find a lift associated with your phone number")
                console.log('No donor')
            }
            
        })
}

/*
Give a list of available ongoing 
*/
exports.getAvailableLifts = (req, res) => {
    const dateTime = new Date()
    Lift.aggregate([{$lookup: {from: 'donors', localField: 'donor', 'foreignField': '_id', as: 'donorDetails'}},
                    {$lookup: {from: 'foodbanks', localField: 'destination', 'foreignField': '_id', as: 'foodBankDetails'}}])
        .then(result => {
            result = result.filter(lift => {
                availability = new Date(lift.availability.date.year, lift.availability.date.month - 1, lift.availability.date.day, lift.availability.time.hour, lift.availability.time.minute)
                console.log(availability, dateTime, availability > dateTime)
                return (availability > dateTime && !lift.hasVolunteer && lift.status !== "Complete")
            })
            console.log(result)
            res.send(result)
        })
        .catch(err => console.log(err))
}
