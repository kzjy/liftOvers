// var Donors = require("../models/donors");

exports.findAll = function(req, res) {
    // Retrieve and return all notes from the database.
    let { page = 1, limit = 10 } = req.query;
    Donors.paginate({}, { page, limit }).then(donors => {
      if (!donors)
        return res.status(404).send({ message: "No donors found." });
      return res.status(200).send(donors);
    });
  };



  /*
Edits the information of donor with email donorEmail
Sample request format: 
{
	"donorEmail": "qweojqije",
	"update": {"name": "james"} 
}
*/
exports.editDonorInfo = function(req, res){
    const {donorEmail, update} = req.body;
    const query = {email: donorEmail};
    Volunteer.findOneAndUpdate(query, update, (err, doc)=> {
      if (err) {
        return res.status(404).send("something went wrong");
      }
      if(!doc){
        return res.status(404).send("volunteer not found")
      }
      else{
        return res.status(200).send(doc)
      } 
     } 
    )
  }
  
