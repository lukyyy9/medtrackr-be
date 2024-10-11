const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Doctors = sequelize.define('doctors', {
    
        userId: {
            type: DataTypes.INTEGER,
            references:{
                model:'users',
                key: 'id'
            },
            allowNull: false,
            unique: true
        },

        healthOrganisation: {
            type: DataTypes.STRING,
        },

        clinicAdress: {
            type: DataTypes.STRING,
        },

        startTime: {
            type: DataTypes.TIME,
        },

        endTime: {
            type: DataTypes.TIME,
        },


});
    return Doctors


}