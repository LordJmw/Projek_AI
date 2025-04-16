const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {users} = require("./../models/users.models")

const bcrypt = require("bcrypt")

router.get("/",async (req,res) => {
    try {
       const response = await users.findAll()
       res.status(200).json({
        success : true,
        data : response
       })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success : false,
            message : "internal server error"
        })
    }
})

router.post("/register", async (req,res) => {
    try {
        const {name,email,birthdate,password,height_cm,weight_kg,gender,goal,daily_activity_category} = req.body
        // console.log(email,password,name,height_cm,weight_kg,gender,goal,daily_activity_category)
        const saltRounds = 10
        const hashedPass = await bcrypt.hash(password,saltRounds)

        const newUser = await users.create({
            name,
            email,
            birthdate,
            password : hashedPass,
            height_cm,
            weight_kg,
            gender,
            goal,
            daily_activity_category
        })

        res.status(201).json({
            success : true,
            message : "user successfully register"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success : false,
            message : "internal server error"
        })
    }
})

router.post("/login",async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await users.findOne({where : {
            email
        }})

        if(!user){
            return res.status(404).json({
                message : "Email Not Found"
            })
        }
        const match  = await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(401).json({message : "inccorect password"})
        }

        const payload = {
            id : user.id,
            email : user.email
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn : "2h"})

        return res.status(200).json({
            success : true,
            message : "Login Successful",
            token,
            user : {
                id : user.id,
                email : user.email
            }
        })

    } catch (error) {
        console.error(error)
    }
})

module.exports = router