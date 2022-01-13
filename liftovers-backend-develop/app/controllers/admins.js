const Volunteer = require('../models/volunteer')
const Lift = require('../models/lifts')
const Donor = require('../models/donors')
const FoodBank = require('../models/foodbank')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const superSecretKey = "dlWrFfbcvwM6gt7Wc8QfYkBYQEXn5eMn"
const bcrypt = require('bcrypt')

/*
Create an Volunteer with admin privilege
*/
exports.createAdmin = (req, res) => {
    const { name, email, password, password2, phone, secretKey } = req.body;
    let errors = []

    // Check if fields are missing
    if (!email || !secretKey) {
        errors.push({ msg : "Please fill in all the required fields"})
        res.status(400).send(errors)
        return
    }

    // Check if secret key is correct
    if (secretKey !== superSecretKey) {
        errors.push({ msg: "Secret key is incorrect"})
        res.status(401).send(errors)
        return
    }

    // Check if email exists
    Volunteer.findOne({ email: email})
        .then(user => {
            if (user) {
                // Email exists, update volunteer to an admin
                Volunteer.findOneAndUpdate({"_id": user._id}, { "role": "admin"})
                    .then(result => {
                        console.log(result)
                        res.send({msg: "Admin elevation successful", admin: result})
                    })

            } else {
                // Email doesn't exist, create a new volunteer

                // Check if required field is missing 
                if (!name || !phone || !password) {
                    errors.push({msg: "Please fill in all the required fields"})
                    res.status(400).send(errors)
                    return
                }

                const newVolunteer = new Volunteer({
                    name: name,
                    email: email,
                    password: password,
                    phone: req.body.phone,
                    postalCode: req.body.postalCode,
                    availability: req.body.availability,
                    role: "admin"
                })

                // Hash password
                bcrypt.genSalt(10, (err, salt) =>   
                    bcrypt.hash(newVolunteer.password, salt, (err, hash) => {
                        if (err) {
                            errors.push({ msg : err})
                            res.send(errors)
                        } else {
                            newVolunteer.password = hash
                            // Save new volunteer information
                            newVolunteer.save()
                                .then(() => {
                                    // Register success
                                    console.log('success')
                                    res.send({msg: "Admin creation successful", admin: newVolunteer})
                                })
                                .catch(err => {
                                    console.log(err)
                                    errors.push({ msg : err})
                                    res.status(500).send(errors)
                                })
                        }
                    }))
            }
        })
    
}

/*
Get all requests
*/
exports.getLifts = (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const display = req.query.display;

    if (display !== 'all' && display !== 'Incomplete' && display !== 'Cancelled' && display !== 'Complete') {
        res.status(400).send({msg: "Invalid display mode"})
        return
    }

    let aggregate = Lift.aggregate([{$lookup: {from: 'donors', localField: 'donor', 'foreignField': '_id', as: 'donorDetails'}},
                                    {$lookup: {from: 'volunteers', localField: 'volunteer', 'foreignField': '_id', as: 'volunteerDetails'}},
                                    {$lookup: {from: 'foodbanks', localField: 'destination', 'foreignField': '_id', as: 'foodBankDetails'}},
                                    { $sort: { "availability": -1 } }])

    if (display === 'all') {
        Lift.aggregatePaginate(aggregate, { page, limit})
            .then(lifts => {
                if (!lifts) {
                    res.status(404).send({msg: "No lifts were found"})
                } else {
                    res.send(lifts)
                }
            });
        return
    } else {
        Lift.paginate({ "status": `${display}`}, { page, limit})
            .then(lifts => {
                if (!lifts) {
                    res.status(404).send({msg: "No lifts were found"})
                } else {
                    res.send(lifts)
                }
            });
        return
    }
}

/*
Give all lifts infomation
*/
exports.getLiftsCsvFile = (req, res) => {
    Lift.aggregate([{$lookup: {from: 'donors', localField: 'donor', 'foreignField': '_id', as: 'donorDetails'}},
                    {$lookup: {from: 'volunteers', localField: 'volunteer', 'foreignField': '_id', as: 'volunteerDetails'}},
                    {$lookup: {from: 'foodbanks', localField: 'destination', 'foreignField': '_id', as: 'foodBankDetails'}},
                    { $sort: { "availability": -1 } }])
                    .then(doc => {
                        const { Parser } = require('json2csv');
                        const fields = ['donorDetails.firstName', 'donorDetails.lastName', 'availability.date', 'availability.time',
                        'foodBankDetails.agency', 'description', 'hasVolunteer', 'volunteerDetails.name', 'status', 'reason']
                        const json2csvParser = new Parser({ fields });
                        const csv = json2csvParser.parse(doc);
                        console.log(csv);
                        res.send(csv)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).send("Can't get all lifts for csv file download")
                    })
}

/*
Delete a lift
*/
exports.removeLift = (req, res) => {
    console.log('called')
    if (!req.query.lift) {
        res.status(400).send({msg: "Lift id is not defined"})
        return
    }
    Lift.deleteOne({ _id: req.query.lift })
        .then(result=> {
            res.send(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({msg: err})
        })
}

/*
Get lift detail
{
    "_id": "someid"
}
*/
exports.getLiftDetail = (req, res) => {
    if (!req.body._id) {
        res.status(400).send({msg: "Lift id is not defined"})
        return
    }
    console.log(req.body._id)
    Lift.aggregate([{$lookup: {from: 'donors', localField: 'donor', 'foreignField': '_id', as: 'donorDetails'}},
                    {$lookup: {from: 'volunteers', localField: 'volunteer', 'foreignField': '_id', as: 'volunteerDetails'}},
                    {$match: { _id : ObjectId(req.body._id)}}])
        .then(result => {
            if (result.length === 0) {
                res.status(400).send({msg: "Cannot find the lift corresponding to that _id"})
                return
            }
            res.send(result)
            console.log(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({msg: "An error has occured"})
        })
}

/*
Get all donors
*/
exports.getDonors = (req, res) => {
    let { page = 1, limit = 10} = req.query;
    console.log('get donor')
    Donor.paginate({}, { page, limit, sort: { firstName: 1, lastName: 1 } })
        .then(donor => {
            if (!donor) {
                res.status(404).send({msg: "No donors were found"})
            } else {
                res.send(donor)
            }
        });
    return
}

/*
Get all donors into a csv file
*/
exports.getDonorsCsvFile = (req, res) => {
    Donor.aggregate([{$lookup: {from: 'lifts', localField: 'lastSubmittedRequest', 'foreignField': '_id', as: 'lastSubmittedRequest'}}])
        .then(doc => {
            const { Parser } = require('json2csv');
            const fields = ['email', 'firstName', 'lastName', 'phone',
            'address', 'contactPreference', 'recurring', 'notes', 'lastSubmittedRequest.availability']
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(doc);
            console.log(csv);
            res.send(csv)
        })
        .catch(err => {
            res.status(500).send({ msg: err })
        })
}

/*
Delete a donor
*/
exports.removeDonor = (req, res) => {
    if (!req.query.donor) {
        res.status(400).send({msg: "Donor id is not defined"})
        return
    }
    console.log('remove donor')
    Donor.deleteOne({ _id: req.query.donor })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

/*
Get info on specific donor and donor's lifts
{
    "email": "email@email.com"
}
*/
exports.getDonorDetail = (req, res) => {
    if (!req.body.email) {
        res.status(400).send({msg: "Email of donor missing"})
        return
    }
    Donor.aggregate([ {$lookup: {from: 'lifts', localField: '_id', 'foreignField': 'donor', as: 'liftDetails'}}, {$match: { "email": req.body.email}}])
        .then(result => {
            if (result) {
                res.send(result)
            } else {
                res.status(500).send({ msg: "An error has occured during donor lookup"})
            }
        })
}

/*
Get all volunteers
*/
exports.getVolunteers = (req, res) => {
    // Retrieve and return all notes from the database.
    let { page = 1, limit = 10 } = req.query;
    Volunteer.paginate({}, { page, limit, sort: { name: 1, phone: 1 }  }).then(volunteers => {
        if (!volunteers) {
            return res.status(404).send({ message: "No Volunteers found." })
        }
        return res.status(200).send(volunteers)
    })
}

/*
Give all lifts infomation
*/
exports.getVolunteersCsvFile = (req, res) => {
    Volunteer.aggregate([{$lookup: {from: 'lifts', localField: 'lastReceivedRequest', 'foreignField': '_id', as: 'lastReceivedRequest'}},
                        {$lookup: {from: 'lifts', localField: 'lastAcceptedRequest', 'foreignField': '_id', as: 'lastAcceptedRequest'}}]
                        )
            .then(doc => {
                const { Parser } = require('json2csv');
                const fields = ['email', 'name', 'phone', 'postalCode', 'availability', 'lastReceivedRequest.availability', 'lastAcceptedRequest.availability', 'role']
                const json2csvParser = new Parser({ fields });
                const csv = json2csvParser.parse(doc);
                console.log(csv);
                res.send(csv)
            })
            .catch(err => {
                res.status(500).send({ msg: err})
            })
}

/*
Delete a volunteer
*/
exports.removeVolunteer = (req, res) => {
    if (!req.query.volunteer) {
        res.status(400).send({msg: "volunteer id is not defined"})
        return
    }
    Volunteer.deleteOne({ _id: req.query.volunteer })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.status(500).send({msg: "An error has occured"})
        })
}

/*
Get info on specific volunteer and volunteer's lifts
{
    "email": "some@email.com"
}
*/
exports.getVolunteerDetail = (req, res) => {
    if (!req.body.email) {
        res.status(400).send({msg: "Email of volunteer missing"})
        return
    }
    Volunteer.aggregate([ {$lookup: {from: 'lifts', localField: '_id', 'foreignField': 'volunteer', as: 'liftDetails'}}, {$match: { "email": req.body.email}}])
        .then(result => {
            if (result) {
                res.send(result)
            } else {
                res.status(500).send({ msg: "An error has occured during volunteer lookup"})
            }
        })
}

/*
Get info food banks
*/
exports.getFoodBanks = (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    FoodBank.paginate({}, { page, limit, sort: { agency: 1, address: 1 } }).then(banks => {
        if (!banks) {
            return res.status(404).send({ message: "No Food Banks found." })
        }
        return res.status(200).send(banks)
    })
}

/*
Get info food banks
*/
exports.getFoodBanksCsvFile = (req, res) => {
    FoodBank.find({}, function (err, doc) {
        if (err) {
            res.status(500).send({ msg: err })
        } else {
            const { Parser } = require('json2csv');
            const fields = ['agency', 'accepts', 'type', 'address', 'community', 'phone', 'hours', 'limitations', 'contact', 'email']
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(doc);
            console.log(csv);
            res.send(csv)
        }
    })
}

/*
Delete a food bank
*/
exports.removeFoodBank = (req, res) => {
    if (!req.query.foodBank) {
        res.status(400).send({msg: "foodBank id is not defined"})
        return
    }
    FoodBank.deleteOne({ _id: req.query.foodBank })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
}

/*
Get the total number of completed lifts by month completed
*/

exports.getTotalMonths = (req, res) => {
    const currentYear = new Date().getFullYear();

    Lift.aggregate([
        { $match: { "availability.date.year": currentYear } },
        { $match: { "status": "Complete" } },
    ]).then(result => {
        let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        result.map(lift => {
            counts[lift.availability.date.month - 1] += 1
        })
        res.send(counts);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "There was a problem with getting the stat info" });
    })
}

/*
Get the total number of completed lifts
*/

exports.getTotalCompleted = (req, res) => {

    Lift.aggregate([
        { $match: { "status": "Complete" } },
        { $count: "numCompleted" }
    ]).then(result => {
        res.send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "There was a problem with getting the stat info" });
    })
}

/*
Get the total number of canceled lifts
*/

exports.getTotalCancelled = (req, res) => {

    Lift.aggregate([
        { $match: { "status": "Cancelled" } },
        { $count: "numCancelled" }
    ]).then(result => {
        res.send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "There was a problem with getting the stat info" });
    })
}

/*
Get the total number of incomplete lifts
*/

exports.getTotalIncomplete = (req, res) => {
    Lift.aggregate([
        { $match: { "status": "Incomplete" } },
        { $count: "numIncomplete" }
    ]).then(result => {
        res.send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "There was a problem with getting the stat info" });
    })
}


/*
Get the total number of volunteers
*/

exports.getTotalVolunteers = (req, res) => {
    Volunteer.aggregate([
        { $count: "numVolunteers" }
    ]).then(result => {
        res.send(result);
    }).catch(err => {
        console.log(err);
        res.status(500).send({ msg: "There was a problem with getting the stat info" });
    })
}