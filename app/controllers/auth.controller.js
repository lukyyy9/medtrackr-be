const db = require("../models/index.js");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.roles;
const Doctor = db.doctors;
const Patient = db.patients;
const Relative = db.relatives;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  switch (req.roleId){
    case 1:
      Doctor.create({
        user: {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          phoneNumber: req.body.phoneNumber,
          roleId : req.roleId,
          gender : req.body.gender,
          dateOfBirth : req.body.dateOfBirth
        }
      }, {
        include: [User]
      }).then(()=>{
        return res.send({ message: "User registered successfully!" });
      }).catch(err => {
        console.error("Error while trying to create doctor user : \n", err);
        return res.status(500).send( { message : "Internal Server Error" } );
      });
      break;
    case 2:
      let patient = {
        doctorId : req.doctorId,
        user: {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          phoneNumber: req.body.phoneNumber,
          roleId : req.roleId,
          gender : req.body.gender,
          dateOfBirth : req.body.dateOfBirth
        }
      }
      if (req.relativeId){
        patient.relativeId = req.relativeId;
      }

      Patient.create(patient, {
        include: [User]
      }).then(()=>{
        return res.send({ message: "User registered successfully!" });
      }).catch(err=>{
        console.error("Error while trying to create patient user : ", err);
        return res.status(500).send({ message: "Internal Server Error"});
      });
      break;
    case 3:
      Relative.create({
        user: {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          phoneNumber: req.body.phoneNumber,
          roleId : req.roleId,
          gender : req.body.gender,
          dateOfBirth : req.body.dateOfBirth
        }
      }, {
        include: [User]
      }).then(()=>{
        return res.send({ message: "User registered successfully!" });
      }).catch(err => {
        console.error("Error while trying to create relative user : \n", err);
        return res.status(500).send( { message : "Internal Server Error" } );
      });
      break;
    default:
      console.log(`Role ${req.roleId}`)
      console.error("Role switch-case in signup failed")
      return res.status(500).send({ message: "Internal Server Error" });
  }
};


exports.login = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      else{
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        var token = jwt.sign({ userId: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
  
  
        user.getRole().then(role => {
          res.status(200).send({
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: role.name,
            gender: user.gender,
            dateOfBirth : req.body.dateOfBirth,
            accessToken: token
          });
        });
      }
    }).catch(err => {
      console.error("Error in login : ", err);
      return res.status(500).send({ message: "Internal Server Error" });
    });
};