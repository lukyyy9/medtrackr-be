
const db = require("../models/index.js");
const Patient = db.patients;
const User = db.users;
const Doctor = db.doctors;
const PatientMedication = db.patientMedications;
const PatientSensor = db.patientSensors;
const Transfer = db.transfers;
const TransferEntry = db.transferEntries;


exports.transferData = async (req, res) => {
  let transaction = await db.sequelize.transaction({autocommit:false});
  try{
    let transfer = await Transfer.create({
      patientId: req.patientId,
    },{
      transaction : transaction
    })

    for (let i=0; i<req.body.length; i++){
      let patientSensor = await PatientSensor.findOne({
        where : {
          id: req.body[i].sensorId
        }
      });
      
      if (!patientSensor){
        transaction.rollback();
        return res.status(400).send({ message : "Sensor ID provided not found in DB."})
      } else{

        
        if (req.body[i].value === patientSensor.sensorThreshold){
          await Patient.update({
            healthStatus : 0
          },{
            where : {
              id: req.patientId
            },
              transaction : transaction
          });
        }

        await TransferEntry.create({
          transferId : transfer.id,
          sensorId : req.body[i].sensorId,
          date : req.body[i].dateTime,
          value: req.body[i].value  
        },{
          transaction : transaction
        });
      }
    }
    transaction.commit();
    return res.send({ message : "Data transfered successfully "});
  } catch (err) {
    transaction.rollback();
    console.error("Error in transferData route : ", err);
    return res.status(500).send({ message : "Internal Server Error" })
  }
}


exports.setSensor = (req, res) => {
  if(!req.body.sensorName){
    return res.status(400).send({
      message: "You need to provide the sensor's name."
    });
  } else if(!req.body.sensorThreshold){
    return res.status(400).send({
      message: "You need to provide the sensor's abnormal value."
    });
  } else {
    PatientSensor.findOne({
      where: {
        sensorName: req.body.sensorName,
        patientId: req.patientId
      }
    }).then(patientSensor => {
      if(patientSensor){
        return res.status(400).send({
          message: "The sensor you provided is already used by this patient."
        })
      } else {
        PatientSensor.create({
          sensorName: req.body.sensorName,
          patientId: req.patientId,
          sensorThreshold: req.body.sensorThreshold
        }).then(() => {
          return res.send({ message: "Sensor activated successfully." })
        })
      }
    }).catch(err => {
      console.error("Error in setSensor route : ", err);
      return res.status(500).send({
        message: "Internal Server Error"
      });
    })
  }
}

exports.getSensors = (req, res) => {
  PatientSensor.findAll({
    where : {
      patientId: req.patientId
    }
  }).then(patientMedications => {
    return res.send(patientMedications)
  }).catch(err => {
    console.error("Error in getMedication route : ", err);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  })
}

exports.setMedication = (req, res) => {
  if (!req.body.medication){
    return res.status(400).send({
      message: "You need to provide a medication to assign to a patient."
    });
  } else {
    PatientMedication.findOne({
      where : {
        medicationName : req.body.medication,
        patientId : req.params.patientId
      }
    }).then(patientMedication => {
      if (patientMedication){
        return res.status(400).send({
          message: "The medication you provided is already taken by this patient."
        })
      } else {
        PatientMedication.create({
          medicationName : req.body.medication,
          patientId : req.params.patientId
        }).then(() => {
          return res.send({ message: "Medication assigned successfully." })
        })
      }
    }).catch(err => {
      console.error("Error in setMedication route : ", err);
      return res.status(500).send({
        message: "Internal Server Error"
      });
    })
  }
}


exports.getMedication = (req, res) => {
  PatientMedication.findAll({
    where : {
      patientId: req.params.patientId || req.patientId
    }
  }).then(patientMedications => {
    return res.send(patientMedications)
  }).catch(err => {
    console.error("Error in getMedication route : ", err);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  })
}


exports.removeMedication = (req, res) => {
  PatientMedication.destroy({
    where : {
      medicationName: req.body.medicationName,
      patientId: req.params.patientId 
    }
  }).then(destroyed => {
    if(destroyed==1){
      return res.send({message : "Medication successfully removed."})

    }else {
      return res.status(400).send({
        message: "Medication not found"
      });
    }
  }).catch(err => {
    console.error("Error in removeMedication route : ", err);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  })
}


exports.getPatient = (req, res) => {
  Doctor.findOne({
    where : {
      userId : req.userId
    }
  }).then(doctor => {
    Patient.findOne({
      where : {
        id : req.params.patientId,
        doctorId : doctor.id
      },
      attributes: { exclude: ['userId', 'doctorId', 'relativeId'] },
      include: {
        model: User,
        as: 'user',
        attributes: { exclude: ['password', 'id', 'roleId'] }
      }
    }).then(patient => {
      if (!patient) {
        return res.status(400).send({
          message: "This patient is not in your charge."
        });
      } else {
        return res.send(patient);
      }
    })
  }).catch(err => {
    console.error("Error in doctor's getPatient route : ", err);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  })
}

exports.getPatients = (req, res) => {
  Doctor.findOne({
    where: {
      userId: req.userId
    }
  }).then(doctor => {
    Patient.findAll({
      offset: (req.query.page-1) * req.query.perPage,
      limit: parseInt(req.query.perPage),
      order: [
        ['id', 'ASC']
      ],
      attributes: { exclude: ['userId', 'doctorId', 'relativeId'] },
      include: {
        model: User,
        as: 'user',
        attributes: { exclude: ['password', 'id', 'roleId'] }
      },
      where:{
        doctorId: doctor.id
      }
    }).then(patients => {
      result = {
        pagination: {
          page: req.query.page,
          perPage: req.query.perPage
        },
        data: patients
      }
      Patient.count({
        where:{
          doctorId: doctor.id
        }
      }).then(total =>{
        result.pagination.total = total;
        res.send(result);
      })
    })
    .catch(err => {
      console.error("Error in doctor's getPatients route : ", err);
      return res.status(500).send({
        message: "Internal Server Error"
      });
    });
  }).catch(err => {
    console.error("Error in doctor's getPatients route : ", err);
    return res.status(500).send({
      message: "Internal Server Error"
    });
  });
}