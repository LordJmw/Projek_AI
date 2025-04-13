const {sequelize,DataTypes} = require("./models")

const users = sequelize.define("users",{
    name : DataTypes.STRING,
    birthdate : DataTypes.DATE,
    email : DataTypes.STRING,
    password : DataTypes.STRING,
    height_cm : DataTypes.INTEGER,
    weight_kg : DataTypes.INTEGER,
    gender : DataTypes.ENUM("m","f"),
    goal : DataTypes.ENUM("cut",'maintain','bulk'),
    daily_activity_category : DataTypes.STRING
})

module.exports = {users}
