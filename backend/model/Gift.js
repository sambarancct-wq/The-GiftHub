import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GiftStatus = ["Available", "Reserved", "Purchased"];

const giftSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true
  },
  recipient: { 
    type: String, 
    required: true,
    trim: true 
  },
  notes: { 
    type: String,
    trim: true 
  },
  price: { 
    type: Number, 
    required:true,
    min: 0
  },
  image: { 
    type: String
  },
  status: {
    type: String,
    enum: GiftStatus, 
    default: "Available",
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
}, { timestamps: true });

const Gift = mongoose.model("Gift", giftSchema);

export default Gift;
