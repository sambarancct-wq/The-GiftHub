import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GiftStatus = ["Available", "Reserved", "Purchased"];

const giftSchema = new Schema({
  name: { type: String, required: true },
  recipient: { type: String, required: true },
  notes: { type: String },
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
