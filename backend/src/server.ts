import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import waitlistRoutes from './routes/waitlist';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const mongoUri: string | undefined = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port: number = parseInt(process.env.PORT || "5000", 10);
app.listen(port, () => console.log(`Server running on port ${port}`));

app.use('/api/waitlist', waitlistRoutes);

