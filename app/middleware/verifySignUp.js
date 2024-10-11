const db = require("../models/index.js");
const Role = db.roles;
const User = db.users;
const Doctor = db.doctors;
const Relative = db.relatives;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      return res.status(400).send({
        message: "Failed! Email provided is already in use!"
      });
    } else {
      next();
    }
  }).catch(err=>{
    console.error("Error while trying to check duplicate email : \n", err);
    return res.status(500).send({ message: "Internal Server Error" });
  });;
};

checkDuplicatePhone = (req, res, next) => {
    // Phone
    User.findOne({
      where: {
        phoneNumber: req.body.phoneNumber
      }
    }).then(user => {
      if (user) {
        return res.status(400).send({
          message: "Failed! Phone provided is already in use!"
        });
      } else{
        next();
      }
    }).catch(err=>{
      console.error("Error while trying to check duplicate phone : \n", err);
      return res.status(500).send({ message: "Internal Server Error" });
    });
};

checkRoleExists = (req, res, next) => {
  if (req.body.role) { 
    Role.findOne({
      where: {
        name: req.body.role
      }
    }).then(role => {
      if (!role){
        return res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.role
        });
      } else { 
        req.roleId = role.id;
        next();
      }
    }).catch(err=>{
      console.error("Error while trying to verify role : \n", err);
      return res.status(500).send({ message: "Internal Server Error" });
    });
  } else {
    return res.status(400).send({
      message: "Failed! Provided no role."
    });

  }
};

checkDoctorEmailExists = (req, res, next) => {
  if(req.body.role ==='Patient'){
    if (req.body.doctorEmail){
      Doctor.findOne({
        include: {
          model: User,
          as: 'user',
          where: {
            email: req.body.doctorEmail
          }
        }
      }).then((doctor) => {
        if (!doctor){
          return res.status(400).send({ message: "The email you provided is not used by any doctor !" })
        } else {
          req.doctorId = doctor.id;
          next();
        }
      }).catch(err=>{
        console.error("Error while trying to verify doctor email : \n", err);
        return res.status(500).send({ message: "Internal Server Error" });
      });
    } else {
      return res.status(400).send({ message: "To sign up as a patient, you need to provide the Email of your doctor !" })
    }
  } else {
    next();
  }
}


checkRelativeEmailExists = (req, res, next) => {
  if(req.body.role ==='Patient'){
    if (req.body.relativeEmail){
      Relative.findOne({
        include: {
          model: User,
          as: 'user',
          where: {
            email: req.body.relativeEmail
          }
        }
      }).then((relative) => {
        if (!relative){
          return res.status(400).send({ message: "The email you provided is not used by any relative user !" })
        } else {
          req.relativeId = relative.id;
          next();
        }
      }).catch(err=>{
        console.error("Error while trying to verify relative email : \n", err);
        return res.status(500).send({ message: "Internal Server Error" });
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

const verifySignUp = {
  checkDuplicateEmail,
  checkDuplicatePhone,
  checkRoleExists,
  checkDoctorEmailExists,
  checkRelativeEmailExists
};

module.exports = verifySignUp;
