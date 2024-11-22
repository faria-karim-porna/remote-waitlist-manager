class SeatAvailabilityObserver {
    // The method signature now includes the type of `availableSeats`
    update(availableSeats: number): void {
      console.log(`Seats available: ${availableSeats}`);
      // Add WebSocket or email notification logic here
    }
  }
  
  export default SeatAvailabilityObserver;
  