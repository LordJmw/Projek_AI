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

router.get("/user-data", async (req, res) => {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const user = await users.findByPk(verified.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                goal: user.goal,
                height: user.height_cm,
                weight: user.weight_kg,
                gender: user.gender,
                birthdate : user.birthdate,
                activity: user.daily_activity_category,
            }
        })
    } catch (err) {
        console.error("JWT verify error:", err)
        return res.status(401).json({ message: "Invalid or expired token" })
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