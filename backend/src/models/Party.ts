import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the document
export interface IParty extends Document {
  name: string;
  size: number;
  status: "waiting" | "seated";
  createdAt: Date;
}

// Define the schema
const partySchema: Schema<IParty> = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  status: { type: String, enum: ["waiting", "seated"], default: "waiting" },
  createdAt: { type: Date, default: Date.now },
});

// Create and export the model
const Party: Model<IParty> = mongoose.model<IParty>("Party", partySchema);

export default Party;
