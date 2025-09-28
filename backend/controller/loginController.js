import User from '../model/User.js';

export const validateUser = async(req,res) => {
    try{
        const { email,password } = req.body;

        if(!email || !password){
            return res.status(400).json({message:"Please provide both email and password."});
        }
    
        const sample = await User.findOne({email,password});
        if(!sample){
            return res.status(401).json({ message: "Invalid credentials." });
        }

        res.status(200).json({
            message: "Login successful",
        });
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred during the login process.", error: error.message });
    }
}