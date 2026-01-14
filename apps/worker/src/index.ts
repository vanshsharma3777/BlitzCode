import express from "express"

const app = express()
app.use(express.json())
const PORT= 3002
app.get("/" , (req , res)=>{
    res.json({
        msg:"workers working fine "
    })
})

app.listen(PORT , ()=>{
    console.log("server running at port" , PORT)
})