const controller = require("../controllers/forms.controller");
const authJwt = require('../middleware/authJwt.js');
const router = require("express").Router()  

module.exports = app => {
    app.use('/api/forms', router);

    router.post("/send", [authJwt.verifyToken], controller.sendForm);
    router.get("/getPatientForms", [authJwt.verifyToken,authJwt.isDoctor], controller.getPatientForms);
    router.get("/getForms", [authJwt.verifyToken], controller.getForms);

}
