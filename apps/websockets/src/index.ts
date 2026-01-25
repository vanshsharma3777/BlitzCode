import express from 'express'

const app = express()
app.use(express.json())
const PORT = 3001 

app.get('/' , async(req ,res)=>{
    try{
        console.log("running /")
    res.json({
        msg:"Running '/'",
        success:true
    })
    }catch(err){
        console.log("error : " , err)
        res.json({
            error: err,
            success:false
        })
    }
})

app.listen( PORT || 3001, ()=>{
    console.log("Websockets server running at PORT :" , PORT)
})