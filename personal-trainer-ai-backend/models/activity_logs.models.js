const { sequelize,DataTypes } = require("./models")

const activity_logs = sequelize.define("activiy_logs",{
    user_id : {
        type : DataTypes.INTEGER,
        references : {
            model : 'users',
            key : 'id'
        }
    },
    calories_burned : DataTypes.INTEGER,
    note : DataTypes.STRING
})

module.exports = {activity_logs}