const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Forms = sequelize.define('forms', {

        patientId:{
            type: DataTypes.INTEGER,
            references:{
                model:'patients',
                key: 'userId'
            }
        },

        completionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        weight: {
            type: DataTypes.FLOAT,
        },

        pain: {
            type: DataTypes.STRING,
        },

        water: {
            type: DataTypes.INTEGER(5),
        },

        mood: {
            type: DataTypes.INTEGER(1),
        },

        apetite: {
            type: DataTypes.INTEGER(1),
        },

        sleep: {
            type: DataTypes.INTEGER(1),
        },

        alcohol: {
            type: DataTypes.INTEGER(1),
        },

        medication: {
            type: DataTypes.STRING
        },

        other: {
            type: DataTypes.STRING(500)
        }
    });
    
    return Forms
}