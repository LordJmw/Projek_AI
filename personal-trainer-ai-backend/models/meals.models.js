const {sequelize,DataTypes} = require("./models")

const meals = sequelize.define("meals",{
    user_id : {
        type : DataTypes.INTEGER,
        references : {
            model : 'users',
            key : 'id'
        }
    },
    name : DataTypes.STRING,
    calories : DataTypes.INTEGER,
    fat : DataTypes.INTEGER,
    carbs : DataTypes.INTEGER,
    protein : DataTypes.INTEGER,
    meal_type : DataTypes.ENUM("breakfast",'lunch','dinner','snack')
})

module.exports = {meals}