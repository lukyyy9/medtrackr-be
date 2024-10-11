const verifySignUp = require("../middleware/verifySignUp.js");
const controller = require("../controllers/auth.controller.js");
const router = require("express").Router()  


module.exports = app => {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.use('/api/auth', router);

  /*
   *  SIGNUP
   *
   * 
   */
  router.post(
    "/signup",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkDuplicatePhone,
      verifySignUp.checkRoleExists,
      verifySignUp.checkDoctorEmailExists,
      verifySignUp.checkRelativeEmailExists
    ],
    controller.signup
  );


  /*
   *  LOGIN
   *
   * 
   */
  router.post("/login", controller.login);
};