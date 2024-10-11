

const db = require("../models/index.js");
var bcrypt = require("bcryptjs");

const User = db.users;
const Patient = db.patients;
const Doctor = db.doctors;
const Relative = db.relatives;
const Role = db.roles;


// POPULATES DB 

// POPULATE DATABASE WITH REQUIRED ROLES
roles = [{
  name: "Medecin"
},{
  name: "Patient"
},{
  name: "Proche"
}]

Role.bulkCreate(roles).then(() => {
  console.log("Required roles created")
}).catch( err => {
    if (err.name !== 'SequelizeUniqueConstraintError') {
      console.error("ERROR WHILE CREATING MEDECIN ROLE", err);
        throw err;
    } else {
      console.log("Required roles already exist in DB");
    }
  });
  

// POPULATE DATABASE WITH TEST DATA


if(process.env.NODE_ENV === "development"){

  testDoctors = [];

  testPatients = [];

  testRelatives = [];

  for (let i = 0; i < 9; i++) {
    testDoctors.push({
      user : {
        email: `doctor${i+1}@gmail.com`,  
        password: bcrypt.hashSync(`doctor${i+1}`, 8),
        lastName: "Teur",
        firstName: "Doc",
        phoneNumber: `+33${i}00000000`,
        roleId : 1
      }
    });

    testPatients.push({
      doctorId:1,
      relativeId:1,
      user : {
        email: `patient${i+1}@gmail.com`,  
        password: bcrypt.hashSync(`patient${i+1}`, 8),
        lastName: "Pat",
        firstName: "Ient",
        phoneNumber: `+339${i}0000000`,
        roleId : 2
      }
    });

    testRelatives.push({
      user : {
        email: `relative${i+1}@gmail.com`,  
        password: bcrypt.hashSync(`relative${i+1}`, 8),
        lastName: "Pro",
        firstName: "Che",
        phoneNumber: `+3399${i}000000`,
        roleId : 3
      }
    });
  }
  
  Relative.bulkCreate(testRelatives, {
    include: [User]
  }).then(()=>{
    console.log("Test relatives created");
  }).catch( err => {
    if (err.name !== 'SequelizeUniqueConstraintError') {
      console.error("ERROR WHILE CREATING TEST RELATIVES", err);
      throw err;
    } else {
      console.log("Test relative already exists in DB");
    }
  });

  Doctor.bulkCreate(testDoctors, {
    include: [User]
  }).then(()=>{
    console.log("Test doctors created");
  }).catch( err => {
    if (err.name !== 'SequelizeUniqueConstraintError') {
      console.error("ERROR WHILE CREATING TEST DOCTORS", err);
      throw err;
    } else {
      console.log("Test doctor already exists in DB");
    }
  });

  Patient.bulkCreate(testPatients, {
    include: [User]
  }).then(()=>{
    console.log("Test patients created");
  }).catch( err => {
    if (err.name !== 'SequelizeUniqueConstraintError') {
      console.error("ERROR WHILE CREATING TEST PATIENTS", err);
      throw err;
    } else {
      console.log("Test patient already exists in DB");
      console.error(err)
    }
  });
}
