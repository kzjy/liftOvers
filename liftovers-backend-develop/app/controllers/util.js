const axios = require('axios')

const twilio = require('twilio')
// const accountSid = 'AC29bd8166067d95be88f6ce44ce53df5a'
// const authToken = '329955eb209335d85af876937107502c'
const accountSid = 'ACd2d2b7d0881cac8cec406b9666c5b7a0'
const authToken = 'e79cbf5843a25ffe3618c10909b88cfe'
const client = new twilio(accountSid, authToken)
const twilioNumber = '+16476946505'

const Volunteer = require('../models/volunteer')

/*
Returns distance in meters from volunteer to dest
*/
exports.getDistance = (volunteer, dest) => {
    return axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${volunteer}&destinations=${dest}&key=AIzaSyD_LPYQsjwLnEh1fcK74vSsytYgvWHndZQ`)
}

/*
Get available volunteers
*/
exports.fitAvailability = (volunteerAvailability, liftAvailability) => {
    // Unspecified availability
    if (volunteerAvailability.length === 0) {
        return true
    }

    // Specified availability

    const liftDate = new Date(liftAvailability.date.year, liftAvailability.date.month - 1, liftAvailability.date.day)
    const dayOfWeek = liftDate.getDay()
    
    const matched = volunteerAvailability.filter(availability => {
        return (
            availability.dayOfWeek === dayOfWeek &&
            availability.timeStart.hour <= liftAvailability.time.hour &&
            availability.timeEnd.hour >= liftAvailability.time.hour
        )
    })
    return (matched.length > 0) ? true: false
}

/*
Get available volunteers for a lift
*/
exports.alertAvailableVolunteers = (lift, address, bank) => {
    const liftAvailability = lift.availability

    const getFilled = () => Volunteer.find({"availability": { "$exists": true}})

    getFilled().then(v => {

        if (!v) {
            res.status(404).send({msg: "No volunteer found"})
        }

        // Filter out volunteers with diff availability
        v = v.filter(volunteer => {
            return this.fitAvailability(volunteer.availability, liftAvailability)
        })
        
        console.log(v)
        // Check volunteer distance to adddress
        v.map(volunteer => {
            // Send text anyway if volunteer doesn't have postalCode
            if (!volunteer.postalCode) {
                this.sendText(volunteer.name, volunteer.phone, address, lift, bank).then(msg => console.log(msg))
                Volunteer.findOneAndUpdate({ "email": volunteer.email}, { "lastReceivedRequest": lift._id})
                    .catch(err => {
                        console.log(err)
                        res.status(500).send({msg: "Error updating volunteer"})
                    })
            } else {
                // Check if distance is less than 10km before sending
                this.getDistance(volunteer.postalCode, address)
                    .then(response => {
                        const elements = response.data.rows[0].elements[0]
                        if (elements.status === 'NOT_FOUND' || elements.distance === undefined) {
                            console.log('Cannot find address')
                        } else {
                            const dist = elements.distance.value
                            if (dist < 10000) {
                                console.log(volunteer)
                                this.sendText(volunteer.name, volunteer.phone, address, lift, bank).then(msg => console.log(msg)).catch(err => console.log(err))
                                Volunteer.findOneAndUpdate({ "email": volunteer.email}, { "lastReceivedRequest": lift._id}, (err) => {console.log(err)})
                                console.log('Finished sending text')
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            
            return true
        })
    })
}   

/*
Send a lift reques text to phone
*/
exports.sendText = (name, phone, pickupAddress, lift, bank) => {
    console.log('Sending Request Text', name, phone)
    if (!name || !phone || !pickupAddress || !lift || !bank) {
        console.log("Not all parameters are filled")
        return 
    }
    const a = lift.availability
    const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 9) ? a.time.minute : `0${a.time.minute}`}`
    return client.messages.create({
        body: `\nLifTOver: Hi ${name}! Can you pick up the food item at ${pickupAddress} on ${dateString} and deliver to ${bank.agency} located at ${bank.address}?\nDescription: ${lift.description}\nReply with yes or no`,
        to: `+1${phone}`,  // Text this number
        //from: '+16476952333' // From a valid Twilio number
        from: twilioNumber
    })
}

/*
Send a lift confirmation to donor after lift is submitted
*/
exports.sendConfirmationDonor = (name, phone, lift, bank) => {
    console.log('Sending Donor confirmation')
    if (!name || !phone || !lift) {
        console.log("Not all parameters are filled")
        return 
    }
    const a = lift.availability
    const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 9) ? a.time.minute : `0${a.time.minute}`}`
    return client.messages.create({
        body: `\nLifTOver: Hi ${name}! This is to confirm your lift request on ${dateString}. The donation will be delivered to ${bank.agency}.\nReply CANCEL LIFT anytime to cancel the lift.`,
        to: `+1${phone}`,  // Text this number
        //from: '+16476952333' // From a valid Twilio number
        from: twilioNumber
    })
}

/*
Send confirmation email to donor after volunteer is found
*/
exports.sendConfirmation = (phone, availability, volunteer) => {
    console.log('Sending confirmation')
    if (!availability || !phone || !volunteer) {
        console.log("Not all parameters are filled")
        return 
    }
    const a = availability
    const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 9) ? a.time.minute : `0${a.time.minute}`}`
    return client.messages.create({
        body: `A volunteer has been found! ${volunteer.name} will be there to pick up the food item on ${dateString}. The volunteer can be contacted at ${volunteer.phone} in case of any last minute changes.`,
        to: `+1${phone}`, 
        from: twilioNumber
    })
}

/*
Send a lift confirmation to volunteer after volunteer accepts
*/
exports.sendConfirmationVolunteer = (phone, donor, lift) => {
    console.log('Sending Volunteer confirmation')
    if (!donor || !phone || !lift) {
        console.log("Not all parameters are filled")
        return 
    }
    const a = lift.availability
    const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 10) ? a.time.minute : `0${a.time.minute}`}`
    return client.messages.create({
        body: `Thank you, you have been confirmed to pick up the food item on ${dateString}. The donor can be contacted at ${donor.phone} in case of any last minute changes. Reply CANNOT COMPLETE if you cannot make it, COMPLETE if the lift is successfully delivered.`,
        to: `+1${phone}`,  // Text this number
        //from: '+16476952333' // From a valid Twilio number
        from: twilioNumber
    })
}

/*
Send canceled text to volunteer/donor after cancellation
*/
exports.sendCancellation = (phone, availability, isDonor) =>  {
    console.log('Sending cancellation', phone)
    if (!availability || !phone || isDonor === null) {
        console.log("Not all parameters are filled")
        return 
    }
    const a = availability
    const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 9) ? a.time.minute : `0${a.time.minute}`}`
    client.messages.create({
        body: `The ${(isDonor) ? 'donor': 'volunteer'} has cancelled the lift on ${dateString}.`,
        to: `+1${phone}`, 
        from: twilioNumber
    }).catch(err => console.log(err))
}

/*
Send complete confirmation to donor after volunteer marks lift as complete
*/
exports.sendCompleteConfirmation = (phone, volunteer) => {
    if (!volunteer || !phone) {
        console.log("Not all parameters are filled")
        return 
    }
    console.log('Sending complete confirmation')
    return client.messages.create({
        body: `${volunteer.name} has completed the lift request.`,
        to: `+1${phone}`, 
        from: twilioNumber
    })
}

/*
Reply to a sms with text
*/
exports.replyText = (res, text) => {
    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message(text);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}

/*
Parse accept req
*/
exports.parseAcceptReq = (req) => {
    let phone = req.body.From
    const msg = req.body.Body.toLowerCase()
    phone = phone.slice(2)

    if (msg === "yes") {
        return { phone, accepted: true }
    } 
    
    return {phone, accepted: false}
}
