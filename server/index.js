import express from 'express'
const app = express();
import dotenv from 'dotenv'
dotenv.config()

import main from './src/config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './src/routes/userAuthentication.js'
import redisclient from './src/config/redis.js'

app.use(express.json());
app.use(cookieParser())

app.use("/user",authRouter);

const InitializeConnection = async () => {
    try{
       await Promise.all([await main(), await redisclient.connect()]);
       console.log("DB connected");
    }
    catch(err){
        console.error("DB Connection failed" + err)
        throw err;
    }
}

InitializeConnection()
.then(async () => {
   const port = process.env.PORT || 5000
    app.listen(port,()=>{
        console.log(`Server is running at port ${port}`)
    })
})
.catch((err)=>{
    console.error(`ERROR!! ${err}`)
})
