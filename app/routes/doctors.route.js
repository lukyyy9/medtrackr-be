const controller = require("../controllers/doctor.controller.js");
const authJwt = require('../middleware/authJwt.js');
const router = require("express").Router()  

module.exports = app => {
    app.use('/api/doctors', router);
    router.post("/setMyPatientInfos", [authJwt.verifyToken,authJwt.isDoctor], controller.setMyPatientInfos);
}