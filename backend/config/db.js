import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sd2312106:foodie123@cluster0.pj7e1rr.mongodb.net/Foodie-Pee') 
    .then(() => console.log('DB CONNECTED'))        
}

export default connectDB;