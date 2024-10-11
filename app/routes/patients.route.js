const patients = require("../controllers/patient.controller.js");
const authJwt = require('../middleware/authJwt.js');
const utility = require('../middleware/utility.js');

const router = require("express").Router()  


module.exports = app => {
    app.use('/api/patients', router);


    router.post(
        "/transferData",
        [
            authJwt.verifyToken,
            authJwt.isPatient
        ],
        patients.transferData
    );

    router.get(
        "/getSensors",
        [
            authJwt.verifyToken,
            authJwt.isPatient
        ],
        patients.getSensors
    );

    router.post(
        "/setSensors",
        [
            authJwt.verifyToken,
            authJwt.isPatient
        ],
        patients.setSensor
    );

    router.get(
        "/:patientId/detail",
        [
            authJwt.verifyToken,
            authJwt.isDoctor,
            utility.verifyDoctorPatient
        ],
        patients.getPatient
    );

    router.get(
        "/getMedication",
        [
            authJwt.verifyToken,
            authJwt.isPatient
        ],
        patients.getMedication
    )
    
    router.get(
        "/:patientId/getMedication",
        [
            authJwt.verifyToken,
            authJwt.isDoctor,
            utility.verifyDoctorPatient
        ],
        patients.getMedication
    );

    router.post(
        "/:patientId/setMedication",
        [
            authJwt.verifyToken,
            authJwt.isDoctor,
            utility.verifyDoctorPatient
        ],
        patients.setMedication
    );
    
    router.delete(
        "/:patientId/removeMedication",
        [
            authJwt.verifyToken,
            authJwt.isDoctor,
            utility.verifyDoctorPatient
        ],
        patients.removeMedication
    );

    router.get(
        "/",
        [
            authJwt.verifyToken,
            authJwt.isDoctor
        ],
        patients.getPatients
    );
};