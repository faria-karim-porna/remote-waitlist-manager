import Party, { IParty } from '../models/Party';

// Define the PartyRepository class
class PartyRepository {
  // Method to add a new party to the database
  async addParty(partyData: { name: string; size: number }): Promise<IParty> {
    const party = new Party(partyData);
    return await party.save();
  }

  // Method to get the list of parties that are waiting
  async getWaitingParties(): Promise<IParty[]> {
    return await Party.find({ status: 'waiting' }).sort('createdAt');
  }

  // Method to update the status of a party (e.g., from 'waiting' to 'seated')
  async updatePartyStatus(id: string, status: 'waiting' | 'seated'): Promise<IParty | null> {
    return await Party.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export default new PartyRepository();
