var axios = require("axios");
var Lift = require("../models/lifts.js");
var Donor = require("../models/donors.js");
const twilio = require("twilio");
const bcrypt = require('bcrypt')


var Volunteer = require("../models/volunteer.js");
var googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyD_LPYQsjwLnEh1fcK74vSsytYgvWHndZQ"
});


exports.findAll = function(req, res) {
  // Retrieve and return all notes from the database.
  let { page = 1, limit = 10 } = req.query;
  Volunteer.paginate({}, { page, limit }).then(volunteers => {
    if (!volunteers)
      return res.status(404).send({ message: "No Volunteers found." });
    return res.status(200).send(volunteers);
  });
};

/*
Get volunteer information
Sample requeste: 
{
  "email": "something"
}
*/
exports.getProfile = (req, res) => {
  if (!req.query.email) {
    res.status(400).send({msg: "Volunteer email missing"})
    return
  }
  Volunteer.findOne({"email": req.body.email})
    .then(volunteer => {
      if (volunteer) {
        if (volunteer.lastAcceptedRequest) {
          Lift.aggregate([{$match: {_id: volunteer.lastAcceptedRequest}}])
          .then(lift => { 
            Donor.aggregate([{$match: {_id: lift[0].donor}}])
            .then(don => {
              const a = lift[0].availability;
              const dateString = `${a.date.day}-${a.date.month}-${a.date.year} at ${a.time.hour}:${(a.time.minute > 9) ? a.time.minute : `0${a.time.minute}`}`
              res.send({ "volunteer": volunteer, "notification": `Confirmed lift request. Location: ${don[0].address}, Time: ${dateString}, Phone: ${don[0].phone}`})}
              )
              .catch(err => {
                res.status(404).send({msg: "Donor does not exist"})
              })
            })
            .catch(err => {
              res.status(404).send({msg: "Lift request does not exist"})
            })
        } else {
          res.send({ "volunteer": volunteer, "notification": ""})
        }
      } else {
        res.status(404).send({msg: "Volunteer cannot be found"})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({msg: err})
    })
}

/*
Get past volunteer lifts
Sample request format: 
{
	"email": "something"
}
*/
exports.getPastLifts = (req, res) => {
  const email = req.query.email
  Volunteer.findOne({"email": email})
    .then(volunteer => {
      console.log(volunteer);
      Lift.aggregate([
        {$lookup: {from: 'donors', localField: 'donor', 'foreignField': '_id', as: 'donorDetails'}},
        {$lookup: {from: 'foodbanks', localField: 'destination', 'foreignField': '_id', as: 'foodBankDetails'}}, 
        {"$match": {"volunteer": volunteer._id}}])
        .then(result => {
            res.send(result)
        })
        .catch(err => console.log(err))
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ msg: "An unexpected error has occurred"})
    })
}

/*
Get current volunteer lifts
Sample request format:
{
	"email": "something"
}
*/
exports.getCurrentLifts = (req, res) => {
  const email = req.query.email
  Volunteer.findOne({ "email": email })
    .then(volunteer => {
      console.log(volunteer);
      Lift.aggregate([
        { $match: { "status": "Incomplete" } },
        { "$match": { "volunteer": volunteer._id } }
      ]).then(result => {
        res.send(result)
      }).catch(err => console.log(err))
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ msg: "An unexpected error has occurred" })
    })
}


/*
Edits the information of volunteer with email volunteerEmail 
Sample request format: 
{
	"volunteerEmail": "qweojqije",
	"update": {"name": "james"} 
}
*/
exports.editVolunteerInfo = function(req, res){
  const {volunteerEmail, update} = req.body;
  const query = {email: volunteerEmail};
  Volunteer.findOneAndUpdate(query, update, { new: true }, (err, doc)=> {
    if (err) {
      return res.status(404).send("something went wrong");
    }
    if (!doc) {
      return res.status(404).send("volunteer not found")
    }
    if (update["password"]) {
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(doc.password, salt, (err, hash) => {
          if (err) {
            errors.push({ msg: err })
            res.send(errors)
          } else {
            doc.password = hash
            doc.save()
              .then(() => {

                // Register success
                console.log('success')
                return res.status(200).send(doc)
              })
              .catch(err => {
                console.log(err)
                errors.push({ msg: err })
                res.send(errors)
              })
          }
        }))
    }
    else{
      console.log(doc)
      return res.status(200).send(doc)
    } 
   } 
  )
}