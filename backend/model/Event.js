const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  gifts: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Gift',
  }],
  type: {
    type: String,
    enum: ['Birthday', 'Wedding', 'Holiday', 'Anniversary', 'Other'],
    default: 'Other',
  },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
