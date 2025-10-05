import Gift from "../model/Gift.js";

export const addGift = async(req,res) => {
    try {
        const {name,recipient} = req.body;
        
        if(!name || !recipient){
            return res.status(400).json({
                message:"name or recipient are necessary"
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