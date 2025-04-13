require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const port = process.env.PORT || 3000
const userRoutes = require("./routes/user.routes")
const aiRoutes = require("./routes/ai.routes")

app.use("/users",userRoutes)
app.use("/ai",aiRoutes)

app.listen(port, () => {
    console.log(`listening to request on port ${port}`)
})