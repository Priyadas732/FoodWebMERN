import userModel from "../modals/userModal.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import validator from "validator";
// LOGIN FUNCTION
const loginUser = async (req, res) => {
     const { email, password } = req.body;

     try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return res.json({ success:false, message: "User Doesn't Exist" });
        }

        const isMatch = await bycrypt.compare(password, user.password)
        if(!isMatch){
             return res.json({success: false, message:"Invalid Creds"})
        }

        const token = createTokon(user._id);
        res.json({success: true, token})
     }
     catch (error){
          console.log(error)
          res.json({success: false, message: "Error"})   
     }
}

// CREATE A TOKEN
const createTokon = (_id) => {
     return jwt.sign({ _id }, process.env.JWT_SECRET);
}

// REGISTER  FUNCTION
const registerUser = async (req, res) => {
      const {username, password, email} = req.body; 
      
      try {
           const exists = await userModel.findOne({ email})
           if(exists){
                return res.json({success: false, message: "User Already Exists"})
           } 
           //  VALIDATION
           if(!validator.isEmail(email)){
             return res.json({ success: false, message: "Please Enter a valid Email"})
           }
           if(password.length < 8){
             return res.json({ success: false, message: "Password must be at least 8 characters"})
           }
           // IF EVERTHING WORKS
           const salt = await bycrypt.genSalt(10)
           const hashedPassword = await bycrypt.hash(password, salt)

           // NEW USER
           const newUser = new userModel({
             username: username,
             email: email,
             password: hashedPassword
           })

           const user = await newUser.save()

           const token = createTokon(user._id)
           res.json({ success: true, token})
      }
      catch (error){
          console.log(error)
          res.json({success: false, message: "Error"})   
     }
}

export { loginUser, registerUser }