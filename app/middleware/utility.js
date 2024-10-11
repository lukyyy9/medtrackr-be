
const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.users;
const Doctor = db.doctors;
const Patient = db.patients;



verifyProfileUpdate = (req, res, next) => {
    let notDuplicate = {};

    if(req.body.email){
      notDuplicate.email = req.body.email;
    } 
    if(req.body.phoneNumber){
      notDuplicate.phoneNumber = req.body.phoneNumber;
    }
  
    User.findOne({
      where: {
        id: { [Op.ne]: req.userId },
        [Op.or] : notDuplicate
      }
    }).then((user) => {
      if(user){
        return res.status(400).send({ message : "Someone is already using the email or phone number submitted."})
      } else{
        next();
      }
    }).catch(err => {
      console.error("Error in user controller setMyInfos : ", err);
      return res.status(500).send({ message : "Internal Server Error"});
    });
};

verifyDoctorPatient = (req, res, next) => {
  Doctor.findOne({
    where: {
      userId : req.userId
    }
  }).then((doctor)=>{
    Patient.findOne({
      where: {
        id: req.params.patientId,
        doctorId: doctor.id
      }
    }).then((patient) => {
      if(!patient){
        return res.status(400).send({ message : "You are not in charge of this patient."})
      } else{
        next();
      }
    })
  })

}


const utility = {
    verifyProfileUpdate: verifyProfileUpdate,
    verifyDoctorPatient: verifyDoctorPatient
};
module.exports = utility;