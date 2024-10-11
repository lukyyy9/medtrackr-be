const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Patient = sequelize.define('patients', {
    
        userId: {
            type: DataTypes.INTEGER,
            references:{
                model:'users',
                key: 'id'
            },
            allowNull: false,
            unique: true,
        },
        doctorId: {
            type: DataTypes.INTEGER,
            references:{
                model:'doctors',
                key: 'id'
            },
            allowNull: false
        },
        relativeId: {
            type: DataTypes.INTEGER,
            references:{
                model:'relatives',
                key: 'id'
            }
        },

        physicalActivity: {
            type: DataTypes.INTEGER,
        },
    
        prescriptions: {
            type: DataTypes.STRING,
        },
    
        healthStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },

        principalIllness: {
            type: DataTypes.CHAR(35),
        },

        cron: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });
    
    return Patient

}