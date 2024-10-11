const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.users;
const Patient = db.patients;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  else{
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      } else {
        User.findOne({
          where: {
            id: decoded.userId
          }
        }).
          then(user =>{
            if (user == null) {
              return res.status(400).send({
                message: "User doesn't exist"
              });
            } else {
              req.userId = decoded.userId;
              req.roleId = user.roleId;
              next();
            }
          });
      }
    });
  }
};

isDoctor = (req, res, next) => {
  User.findOne({
    where: {
      id: req.userId
    }
  }).then(user => {
    user.getRole().then(role => {
      if (role.name === "Medecin"){
        next();
      }
      else{
        return res.status(403).send({
          message: "Require Doctor role !"
        });
      }
    });
  }).catch(err => {
    console.error("Error while checking if login user is doctor : ", err);
    return res.status(500).send({ message : "Internal Server Error"});
  });
};

isPatient = (req, res, next) => {
  Patient.findOne({
    where: {
      userId : req.userId
    }
  }).then(user => {
    if (!user){
      return res.status(403).send({
        message: "Require Patient role !"
      });
    } else {
      req.patientId = user.id;
      next();
    }
  }).catch(err => {
    console.error("Error while checking if login user is patient : ", err);
    return res.status(500).send({ message : "Internal Server Error"});
  });
}



const authJwt = {
  verifyToken: verifyToken,
  isDoctor: isDoctor,
  isPatient: isPatient
};
module.exports = authJwt;