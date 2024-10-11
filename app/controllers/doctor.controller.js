const db = require("../models/index.js");
const Patient = db.patients;
const Doctor = db.doctors;
const User = db.users;

exports.setMyPatientInfos = async (req, res) => { // A REFACTO

    try {

      if (!req.body.patientEmail) {
        return res.status(400).send({ message: 'No email was provided' });
      }

      const user = await User.findOne({
        where: {
          email: req.body.patientEmail
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'The user does not exist' });
      }

      const idPatient = user.id;

      const patient = await Patient.findOne({
        where: {
          userId: idPatient
        }
      });

      if (!patient) {
        return res.status(404).json({ message: 'The user is not a patient' });
      }

      if(req.body.prescriptions){
        await patient.update({
          prescriptions: req.body.prescriptions
        });
      }

      if(req.body.healthStatus){
        await patient.update({
          healthStatus: req.body.healthStatus
        });
      }

      if(req.body.principalIllness){
        await patient.update({
          principalIllness: req.body.principalIllness
        });
      }
  
      return res.status(200).json({ message: 'Patient information updated successfully' });
    } 
    catch
    {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
