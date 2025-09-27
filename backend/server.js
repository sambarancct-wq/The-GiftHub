import app from './app.js';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv({path:"./.env"});

const port = process.env.PORT || 5000;

const dbURI = process.env.MONGODB_URL;

mongoose.connect(dbURI)
    .then(()=>{
        console.log("Database connected");
    })
    .catch((err)=>{
        console.error("Facing an error",err);
    })

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})