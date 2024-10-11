const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const TransferEntries = sequelize.define("transferEntries", {

        transferId : {
            type: DataTypes.INTEGER,
            references:{
                model:'transfers',
                key: 'id'
            }
        },

        sensorId : {
            type: DataTypes.INTEGER,
            references: {
                model:'patientSensors',
                key: 'id'
            }
        },

        date: {
        type: DataTypes.DATE
        },

        value : {
            type: DataTypes.STRING
        },

    });
    
    return TransferEntries;
};