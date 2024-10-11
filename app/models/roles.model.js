const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Role = sequelize.define("roles", {

        name: {
            type: DataTypes.STRING,
            unique: true
            
        }

    });
  
    return Role;
  };