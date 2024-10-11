const db = require("../models/index.js");
const User = db.users;
const Doctor = db.doctors;
const Patient = db.patients;
const Relative = db.relatives;



exports.getMyInfos= (req, res) => {
  switch (req.roleId){
    case 1:
      Doctor.findOne({
        attributes: { exclude: ['userId'] },
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: ['id', 'password'] }
        },
        where:{
          userId: req.userId
        }
      }).then((doctor) => {
        return res.send(doctor); 
      }).catch((err) => {
        console.error("Error while trying to retrieve user (doctor) profile", err)
        return res.status(500).send({ message: "Internal Server Error" });
      });
      break;
    case 2:
      Patient.findOne({
        attributes: { exclude: ['userId'] },
        include: [{
          model: User,
          as: 'user',
          attributes: { exclude: ['id', 'password'] }
        }, {
          model: Doctor,
          as: 'doctor',
          attributes :  { exclude: ['userId'] },
          include: {
            model: User,
            as: 'user',
            attributes: { exclude: ['id', 'password'] }
          }
        }, {
          model: Relative,
          as: 'relative',
          attributes :  { exclude: ['userId'] },
          include: {
            model: User,
            as: 'user',
            attributes: { exclude: ['id', 'password'] }
          }
        }
      ],
        where:{
          userId: req.userId
        }
      }).then((patient) => {
        return res.send(patient);
      }).catch((err) => {
        console.error("Error while trying to retrieve user (patient) profile", err)
        return res.status(500).send({ message: "Internal Server Error" });
      });

      break;
    case 3:
      Relative.findOne({
        attributes: { exclude: ['userId'] },
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: ['id', 'password'] }
        },
        where:{
          userId: req.userId
        }
      }).then((relative) => {
        return res.send(relative); 
      }).catch((err) => {
        console.error("Error while trying to retrieve user (relative) profile", err)
        return res.status(500).send({ message: "Internal Server Error" });
      });

      break;
    default:
      console.log(`Role ${req.roleId}`)
      console.error("Role switch-case in getInfos failed")
      return res.status(500).send({ message: "Internal Server Error" });
  }
}

exports.setMyInfos = (req, res) => {

  let userData = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    phoneNumber : req.body.phoneNumber,
    dateOfBirth : req.body.dateOfBirth,
    gender : req.body.gender,
    profilePicture: req.body.profilePicture
  };


  db.sequelize.transaction({autocommit:false}).then((transaction) => {
    User.update(userData, {
      where : {id : req.userId},
      transaction: transaction
    })
    .then(() => {
      console.log(req.roleId);
      switch (req.roleId){
        case 1:
        let doctorData = {
          healthOrganisation: req.body.healthOrganisation,
          clinicAdress: req.body.clinicAdress,
          startTime: req.body.startTime,
          endTime: req.body.endTime
        };
        Doctor.update(doctorData, {
          where : {userId : req.userId},
          transaction : transaction
        }).then(()=>{
          transaction.commit();
          return res.send({ message: "User (Doctor) updated successfully" });
        });
          break;
        case 2:
          let patientData = {
            principalIllness: req.body.principalIllness,
            physicalActivity : req.body.physicalActivity,
            cron : req.body.cron
          }
          Patient.update(patientData, {
            where : {userId : req.userId},
            transaction : transaction
          }).then(()=>{
            transaction.commit();
            return res.send({ message: "User (Patient) updated successfully" });
          });
          break;
        case 3:

        let relativeData = {}

        Relative.update(relativeData, {
          where : {userId : req.userId},
          transaction : transaction
        }).then(()=>{
          transaction.commit();
          return res.send({ message: "User (Relative) updated successfully" });
        });
          break;
      }
    })
    .catch((err) =>{
      console.error("Error while updating user", err);
      transaction.rollback();
      return res.status(500).send({ message : "Internal Server Error"});
    })
  });
}

exports.getAlert = async (req, res) => {  // A LIRE
    try
    {
      const doctor = await Doctor.findOne({
        where: {
          userId: req.userId
          }
        });

      const relative = await Relative.findOne({
        where: {
          userId: req.userId
          }
        });

      const patientUser = await Patient.findOne({
        attributes: {exclude: ['id', 'userId', 'cron', 'doctorId', 'relativeId',]},
        where: {
          userId: req.userId
        }
        });


        if(doctor){

          const toWatchPatients = await Patient.findAll({
            attributes: {exclude: ['id', 'userId', 'cron', 'doctorId', 'relativeId']},
            where: {
              doctorId: req.userId,
              healthStatus: "à surveiller"
            }
          });

          const toCallPatients = await Patient.findAll({
            attributes: {exclude: ['id', 'userId', 'cron', 'doctorId', 'relativeId']},
            where: {
              doctorId: req.userId,
              healthStatus: "état critique"
            }
          });

          const toWatchPatientsUserInfos = await toWatchPatients.map(async (watchPatients) => {({
            attributes: {exclude: ['id', 'roleId', 'password', 'profilePicture']},
            where:{
              id: watchPatients.userId
            }
          })
        });
          
          

          const toCallPatientsUserInfos = await toCallPatients.map(async (callPatients) => {({
            attributes: {exclude: ['id', 'roleId', 'password', 'profilePicture']},
            where:{
              id: callPatients.userId
            }
          })
        });
          
          return res.status(200).json(
            {patientsToWatch:
              {infos: toWatchPatientsUserInfos || [],
              healthInfos: toWatchPatients || [],
              message: "These patients are to watch closely"
              },
            patientsToCall:
              {infos: toCallPatientsUserInfos || [],
               healthInfos: toCallPatients || [],
               message: "These patients are in danger, call them or their relative immediately"
              }
            });

        }
        
        if(relative){
          const toWatchRelatives = await Patient.findAll({
            attributes: {exclude: ['id', 'userId', 'cron', 'doctorId', 'relativeId']},
            where: {
              relativeId: req.userId,
              healthStatus: "à surveiller"
            }
          });

          const toCallRelatives = await Patient.findAll({
            attributes: {exclude: ['id', 'userId', 'cron', 'doctorId', 'relativeId']},
            where: {
              relativeId: req.userId,
              healthStatus: "état critique"
            }
          });

          const toWatchRelativesUserInfos = await toWatchRelatives.map(async (watchRelatives) => {({
            attributes: {exclude: ['id', 'roleId', 'password', 'profilePicture']},
            where:{
              id: watchRelatives.userId
            }
          })
        });

          const toCallRelativesUserInfos = await toCallRelatives.map(async (callRelatives) => {({
            attributes: {exclude: ['id', 'roleId', 'password', 'profilePicture']},
            where:{
              id: callRelatives.userId
            }
          })
        });

          return res.status(200).json(
            {relativesToWatch:
              {infos: toWatchRelativesUserInfos || [],
              healthInfos: toWatchRelatives || [],
              message: "These relatives health are to watch closely, give them a call or send them a message !"
              },
            relativessToCall:
              {infos: toCallRelativesUserInfos || [],
               healthInfos: toCallRelatives || [],
               message: "These relatives are in danger, call them immediately !"
              }
            });

        }

        else{
          if(patientUser.healthStatus == "à surveiller"){
            return res.status(200).send({message: "Your health is not good, contact your doctor for more health advices"});
          }
          if(patientUser.healthStatus == "état critique"){
            return res.status(200).send({message: "You are in a very bad shape, contact your doctor immediately to know more about it"});
          }
          else{ 
            return res.status(200).send({message: "You are in a good health ! "});
        }
      }
    }
    catch
    {
      return res.status(500).send({message: "Internal server error"});
    }

  }
  