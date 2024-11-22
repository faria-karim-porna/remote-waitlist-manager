import { IParty } from "../models/Party";
import PartyRepository from "../repositories/PartyRepository";
import { clientConnections } from "../server";

class WaitlistService {
  private capacity: number;
  private availableSeats: number;

  constructor(capacity: number) {
    this.capacity = capacity; // Total seats
    this.availableSeats = capacity; // Available seats
  }

  // Add party to the waitlist
  async addParty(partyData: Omit<IParty, "_id">): Promise<IParty> {
    const party = await PartyRepository.addParty(partyData);
    return party;
  }

  // Check in a party and notify them via WebSocket
  async checkInParty(partyId: string): Promise<IParty | null> {
    const party = await PartyRepository.updatePartyStatus(partyId, "seated");
    if (!party) return null;

    this.availableSeats -= party.size;

    // Notify the party via WebSocket
    if (clientConnections[partyId]) {
      clientConnections[partyId].send(JSON.stringify({ message: "Your table is ready! Please check in." }));
    }

    // Start service countdown
    setTimeout(() => {
      this.completeService(party);
    }, party.size * 3000); // 3 seconds per person

    return party;
  }

  // Complete service for a party and update available seats
  async completeService(party: IParty): Promise<void> {
    this.availableSeats += party.size;

    // Check for the next party in the queue
    const queue = await this.getQueue();
    for (const nextParty of queue) {
      if (nextParty.size <= this.availableSeats) {
        if (clientConnections[nextParty._id ?? ""]) {
          clientConnections[nextParty._id ?? ""].send(JSON.stringify({ message: "Your table is ready! Please check in." }));
        }
        break;
      }
    }
  }

  // Get the current waiting parties
  async getQueue(): Promise<IParty[]> {
    return await PartyRepository.getWaitingParties();
  }
}

export default new WaitlistService(10); // Initialize with 10 seats
