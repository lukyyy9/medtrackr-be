
const process = require('node:process');

const express = require("express");

const cors = require("cors");

require('dotenv').config();

const serverConfig =  require('./app/config/server.config.js');

const app = express();

app.use(cors());

const db = require("./app/models/index.js")

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

process.on('SIGTERM', process.exit);
process.on('SIGINT', process.exit);


db.sequelize.sync({ force: true })
  .then(() => {
    console.log("Synced db.");
    require("./app/models/populate.js");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});



require("./app/routes/patients.route.js")(app);
require("./app/routes/auth.route.js")(app);
require("./app/routes/forms.route.js")(app);
require("./app/routes/doctors.route.js")(app);
require("./app/routes/users.route.js")(app);

// set port, listen for requests
app.listen(serverConfig.NODE_PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on port ${serverConfig.NODE_PORT} in ${serverConfig.NODE_ENV} mode.`);
});


app.get('*', function (req, res) {
    res.send("Medtrackr placeholder text");
});