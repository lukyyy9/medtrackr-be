const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PatientSensors = sequelize.define('patientSensors', {

        patientId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'patients',
                key: 'id'
            }
        },

        sensorName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        sensorThreshold: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    
    return PatientSensors
}