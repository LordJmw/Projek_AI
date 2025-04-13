const { Sequelize,DataTypes } = require("sequelize")

const dialect = process.env.DB_DIALECT || "mysql"

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
    host : process.env.DB_HOST,
    dialect : dialect
})

module.exports =  {sequelize,DataTypes}