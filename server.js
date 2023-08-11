import  express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoute.js'
import productRoutes from './routes/productRoute.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import paymentRoutes from './routes/paymetRoutes.js'

import cors from 'cors';
import path from 'path';



const PORT=process.env.PORT||8080;


// config
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// rest Object
const app= express();

// mongoDb connection
connectDB();



// middleware
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/build')));



// export const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_API_KEY,
//     key_secret: process.env.RAZORPAY_APT_SECRET,
//   });

// ROutes
app.use('/api/v1/auth',authRoutes);
// app.use('/api/v1',paymentRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);


// rest Api
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
});



app.listen(PORT,()=>{
    console.log(`server working on ${process.env.DEV_MODE} mode and listining on port ${PORT}`);
})
