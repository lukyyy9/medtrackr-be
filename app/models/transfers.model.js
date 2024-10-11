const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Transfers = sequelize.define("transfers", {

        patientId : {
            type: DataTypes.INTEGER,
            references:{
                model:'patients',
                key: 'id'
            }
        },

        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
        
    });
  
    return Transfers;
  };