const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PatientMedications = sequelize.define('patientMedications', {

        patientId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'patients',
                key: 'id'
            }
        },

        medicationName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    
    return PatientMedications
}