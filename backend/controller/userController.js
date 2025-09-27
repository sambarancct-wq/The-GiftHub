import User from "../model/User.js";

export const createUser = async (req,res)=>{
    try{
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({newUser});
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
};

export const checkHealth = async(req,res)=>{
    try {
        res.status(200).json({message:"Connections are working perfectly"})
    } catch (err) {
        res.status(400).json({message:err.message});
    }
};

export const getUser = async(req,res)=>{
    try {
        const users = await User.find({});
        res.status(200).json({users});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}