import express, { Request, Response } from "express";
import WaitlistController from "../controllers/WaitlistController";

const router = express.Router();

// Define routes with proper type annotations
router.post("/join", async (req: Request, res: Response): Promise<void> => {
  try {
    await WaitlistController.addParty(req, res);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await WaitlistController.getQueue(req, res);
  } catch (err) {
    console.error("Error fetching queue:", err);
    res.status(500).json({ error: "Failed to fetch the waitlist queue." });
  }
});

router.post("/checkin/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await WaitlistController.checkIn(req, res);
  } catch (err) {
    console.error("Error during check-in:", err);
    res.status(500).json({ error: "Failed to process check-in." });
  }
});

export default router;
