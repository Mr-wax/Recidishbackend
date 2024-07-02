import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import connectDB from "./SRC/database/db.js"
import router from "./SRC/routes/indexRoute.js"


dotenv.config()

const app = express()

app.use(cors({origin:"*"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/api/v1', router)

const startServer = async () => {
    const PORT  = process.env.PORT || 3000;
     await connectDB();
    try {  
    app.listen(PORT, () => {console.log (`RECIDISH APP IS RUNNING ON PORT ${PORT}`);})
    } catch (error) {
        console.log(error);
    }
};

startServer();
app.get("/", (req, res) => {
    res.send('API IS RUNNING')
})