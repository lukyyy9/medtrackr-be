const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Relatives = sequelize.define('relatives', {
    
        userId: {
            type: DataTypes.INTEGER,
            references:{
                model:'users',
                key: 'id'
            },
            allowNull: false,
            unique: true
        }


});
    return Relatives


}