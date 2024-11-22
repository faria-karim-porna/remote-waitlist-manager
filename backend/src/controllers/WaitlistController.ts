import { Request, Response } from 'express';
import WaitlistService from '../services/WaitlistService';

// Define the WaitlistController class
class WaitlistController {
  // Add party to the waitlist
  async addParty(req: Request, res: Response): Promise<void> {
    try {
      const party = await WaitlistService.addParty(req.body);
      res.status(201).json(party);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get the current waitlist (queue)
  async getQueue(req: Request, res: Response): Promise<void> {
    const queue = await WaitlistService.getQueue();
    res.json(queue);
  }

  // Check-in a party and mark them as seated
  async checkIn(req: Request, res: Response): Promise<void> {
    try {
      const party = await WaitlistService.checkInParty(req.params.id);
      res.json(party);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new WaitlistController();
