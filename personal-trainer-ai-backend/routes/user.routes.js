const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {users} = require("./../models/users.models")
const {meals} = require("./../models/meals.models")

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

router.post('/valid-token',async (req,res) => {
    const {token} = req.body
    if(!token){
        return res.status(401).json({
            status : 401,
            message : "unauthorized"
        })
    }

    try {
        const valid = jwt.verify(token,process.env.JWT_SECRET)

        return res.status(201).json({
            status : 201,
            message : "valid token"
        })
    } catch (err) {
        return res.status(401).json({
            message : "invalid token"
        })
        console.error(err)
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
                id : user.id,
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

router.get("/user-meal/:id", async (req, res) => {
    const id = req.params.id

    try {
        const mealsData = await meals.findAll({
            where: { user_id: id },
            order: [['createdAt', 'DESC']] 
        })

        res.status(200).json(mealsData)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
})


router.post("/user-meal/:id",async (req,res) => {
    const {calories,fat,protein,carbs,name,meal_type} = req.body
    const id = req.params.id

    try{
        await meals.create({
            user_id : id,
            name : name,
            calories,
            fat,
            carbs,
            protein,
            meal_type
        })    
        res.status(201).json({
            success : true,
            message : "Data Berhasil Tersimpan"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
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

router.delete("/user-meal/:userId/:mealId", async (req, res) => {
    try {
        await meals.destroy({
            where: {
                id: req.params.mealId,
                user_id: req.params.userId
            }
        });
        
        res.status(200).json({ 
            success: true,
            message: "Meal deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete meal"
        });
    }
});

module.exports = router