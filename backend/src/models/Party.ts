import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the Party document
export interface IParty extends Document {
  _id: null | string;
  name: string;
  size: number;
  status: "waiting" | "seated";
  createdAt: Date;
}

// Define the schema
const partySchema: Schema<IParty> = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  status: { type: String, enum: ["waiting", "seated"], default: "waiting" },
  createdAt: { type: Date, default: Date.now },
});

// Define the model
const Party: Model<IParty> = mongoose.model<IParty>("Party", partySchema);

export default Party;
