const users = require("../controllers/user.controller.js");
const authJwt = require('../middleware/authJwt.js');
const utility = require('../middleware/utility.js');
const router = require("express").Router()  

module.exports = app => {
    app.use('/api/users', router);

    router.post("/setMyInfos", [authJwt.verifyToken, utility.verifyProfileUpdate], users.setMyInfos);
    router.get("/getMyInfos",[authJwt.verifyToken], users.getMyInfos);
    router.get("/getAlert", [authJwt.verifyToken], users.getAlert);
}
