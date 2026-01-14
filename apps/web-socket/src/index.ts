import express from "express"

const app = express()
app.use(express.json())
const PORT= 3001
app.get("/" , (req , res)=>{
    res.json({
        msg:"websockets working fine"
    })
})

app.listen(PORT , ()=>{
    console.log("server running at port" , PORT)
})