const express = require('express')
const router = express.Router()
const volunteer = require("../controllers/volunteer.js");
const bcrypt = require('bcrypt')
const passport = require('passport')
const Volunteer = require('../models/volunteer')

/*
Required
{
    "email": "kelvin@email.com",
    "password": "password123"
}
*/
// Login
exports.login = (req, res, next) => {
    // res.send('login page')
    passport.authenticate('local', (err, user, info) => {
        console.log(req.session)
        if (err) {
            res.status(400).send(info)
        } else if (!user) {
            res.status(401).send(info)
        } else {
            req.logIn(user, (err) => {
                if (!err) {
                    res.send({user: req.user, msg: 'Log in successful'})
                    console.log(res)
                } else {
                    console.log(err)
                    res.status(401).send({ message: 'Unauthorized'})
                }
                
            })
        }
        
    })(req, res, next)
}

// Logout 
exports.logout = (req, res) => {
    req.logout()
    res.send('Log out successful')
}


// Register function 
/*
Required register fields: 
{
	"name": "Kelvin",
	"email": "kelvin@email.com",
	"password": "password123",
	"password2": "password123",
    "phone": "123456789"
}
*/
exports.register = (req, res) => {
    const { name, email, password, password2, phone } = req.body;
    let errors = []

    if (!name || !email || !password || !password2 || !phone ) {
        errors.push({ msg : "Please fill in all the required fields"})
    }

    // Send back result, send errors if not successful
    if (errors.length > 0) {
        res.send(errors)
    } else {
        // Check if email exists
        Volunteer.findOne({ email: email})
            .then(user => {
                if (user) {
                    // Email exists
                    errors.push({ msg : "Email is already in use"})
                    res.send(errors)
                } else {
                    // Email doesn't exist
                    const newVolunteer = new Volunteer({
                        name: name,
                        email: email,
                        password: password,
                        phone: req.body.phone,
                        postalCode: req.body.postalCode,
                        availability: req.body.availability
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
                                        res.send('ok')
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        errors.push({ msg : err})
                                        res.send(errors)
                                    })
                            }
                        }))
                }
            })
    }
}