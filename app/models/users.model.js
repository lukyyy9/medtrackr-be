const { DataTypes } = require("sequelize");

const phoneValRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const genderRegex = /^[MFO]$/;;


module.exports = (sequelize) => {
    const Users = sequelize.define('users', {

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'roles',
                key: 'id'
            }
        },
        
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            isEmail: true
        },

        dateOfBirth: {
            type: DataTypes.DATEONLY
        },

        gender: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            validate: {
                validator: function(v) {
                    return genderRegex.test(v);
                }
            },
            defaultValue: "O"
        },

        phoneNumber: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                validator: function(v) {
                    return phoneValRegex.test(v);
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            password: true
        },
        
        profilePicture: {
            type: DataTypes.STRING
        },
    });
    
    return Users
}