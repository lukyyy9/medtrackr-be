const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    define: {
      timestamps: false,
    },
  });

const db = {};



db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.doctors = require("./doctors.model.js")(sequelize);
db.forms = require("./forms.model.js")(sequelize);
db.patients = require("./patients.model.js")(sequelize);
db.relatives = require("./relatives.model.js")(sequelize);
db.roles = require("./roles.model.js")(sequelize);
db.transferEntries = require("./transferEntries.model.js")(sequelize);
db.transfers = require("./transfers.model.js")(sequelize);
db.users = require("./users.model.js")(sequelize);
db.patientMedications = require("./patientMedications.model.js")(sequelize);
db.patientSensors = require("./patientSensors.model.js")(sequelize);

db.roles.hasMany(db.users);
db.users.belongsTo(db.roles);

db.users.hasOne(db.patients);
db.patients.belongsTo(db.users);

db.users.hasOne(db.doctors);
db.doctors.belongsTo(db.users);

db.users.hasOne(db.relatives);
db.relatives.belongsTo(db.users);

db.doctors.hasOne(db.patients);
db.patients.belongsTo(db.doctors);

db.relatives.hasOne(db.patients);
db.patients.belongsTo(db.relatives);

db.patients.hasMany(db.patientMedications);
db.patientMedications.belongsTo(db.patients);

db.patients.hasMany(db.patientSensors);
db.patientSensors.belongsTo(db.patients);

db.patients.hasMany(db.forms);
db.forms.belongsTo(db.patients);

db.patients.hasMany(db.transfers);
db.transfers.belongsTo(db.patients);

db.transfers.hasMany(db.transferEntries);
db.transferEntries.belongsTo(db.transfers);


module.exports = db;
 