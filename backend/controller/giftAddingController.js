import Gift from "../model/Gift.js";

export const addGift = async(req,res) => {
    try {
        const {name,recipient,price} = req.body;
        
        if(!name || !recipient || price){
            return res.status(400).json({
                message:"name ,recipient and price are necessary"
            });
        }

        const newGift = new Gift(req.body);
        await newGift.save();
        return res.status(201).json({
            message:"Gift Added Successfully!!",
            newGift
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}