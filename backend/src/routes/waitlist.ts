import express, { Request, Response, Router } from "express";
import Party, { IParty } from "../models/Party";

const router: Router = express.Router();

// Add party to the waitlist
router.post("/join", async (req: Request, res: Response): Promise<void> => {
  const { name, size }: { name: string; size: number } = req.body;
  try {
    const party: IParty = new Party({ name, size });
    await party.save();
    res.status(201).json(party);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get current waitlist
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const waitlist: IParty[] = await Party.find({ status: "waiting" }).sort("createdAt");
    res.json(waitlist);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Check-in party
router.post("/checkin/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const party: IParty | null = await Party.findById(req.params.id);
    if (!party) {
      res.status(404).json({ message: "Party not found" });
      return;
    }

    party.status = "seated";
    await party.save();
    res.json(party);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
