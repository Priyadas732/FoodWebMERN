import express from "express";
import cors from "cors";
//import mongoose from "mongoose";
import 'dotenv/config';
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url"; 
import userRouter from "./routes/userRoute.js";
import itemRouter from "./routes/itemRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// import userRoute from "./routes/user.js";
// import authRoute from "./routes/auth.js";
// import productRoute from "./routes/product.js";


const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['https://foodie-pee-frontend.onrender.com', 'https://foodie-pee-admin.onrender.com'];
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DATABASE
connectDB()
// ROUTES
app.use('/api/user', userRouter) 
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use('/api/items', itemRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')         
})

app.listen(port, () =>{
    console.log(`Server Started on http://localhost:${port}`)         
})