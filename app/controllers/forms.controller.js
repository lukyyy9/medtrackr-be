const db = require("../models/index.js");
const Forms = db.forms; 
const Patient = db.patients;
const Doctor = db.doctors;
// FAIRE LES ROUTES NECESSAIRES

// Function to create a form
exports.sendForm = async (req, res) => {
  try {

    const { patientId, completionDate, weight, pain, water, mood, apetite, sleep, alcohol, medication, other } = req.body;

    const patient = await Patient.findOne({
      where: {
        userId: req.userId
      }
    });

    if (!patient) {
      return res.status(404).json({ message: 'You are not a patient !' });
    }

    const form = await Forms.create({
      patientId: req.userId,
      completionDate: completionDate,
      weight: weight,
      pain: pain,
      water: water,
      mood: mood,
      apetite: apetite,
      sleep: sleep,
      alcohol: alcohol,
      medication: medication,
      other: other
    });
    return res.status(201).json({ message: 'Form created successfully', form });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getPatientForms = async (req, res) => {

  const { patientId } = req.query;

  try{
  const docPatient = await Doctor.findOne({
    where: {
      id: req.userId,
      userId: patientId
    }
  })

  if(!docPatient){
    res.status(404).send
    ({message: "You do not have this patient assigned ! "})
  }

  const doctor = await Patient.findOne({
      where: {
        userId: patientId
      }
    })
  const forms = await Forms.findAll({
      offset: (req.query.page-1) * req.query.perPage,
      limit: parseInt(req.query.perPage),
      order: [
        ['id', 'ASC']
      ],
      where: {
        patientId: patientId
      }
    });
    const result = {
      pagination: {
        page: req.query.page,
        perPage: req.query.perPage
      },
      data: forms
    }
    const total = await Forms.count({
      where:{
        patientId: req.userId
      }
    });
    result.pagination.total = total;
    res.send(result);
  }
  catch{
    return res.status(500).send({
        message: "Internal server error"
      });
    };
  }

exports.getForms = async (req, res) => {

  try{
    await Patient.findOne({
      where: {
        userId: req.userId
      }
    });

    const forms = await Forms.findAll({
      offset: (req.query.page-1) * req.query.perPage,
      limit: parseInt(req.query.perPage),
      order: [
        ['id', 'ASC']
      ],
      where: {
        patientId: req.userId
      }
    });

  const result = {
      pagination: {
        page: req.query.page,
        perPage: req.query.perPage
      },
      data: forms
    }
  const total = await Forms.count({
      where:{
        patientId: req.userId
      }
    });
  
  result.pagination.total = total;
  res.send(result);
  
  }
  catch{
    return res.status(500).send({
      message: "Internal Server Error"
    });
  }
}

