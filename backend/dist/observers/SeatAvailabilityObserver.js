"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SeatAvailabilityObserver {
    // The method signature now includes the type of `availableSeats`
    update(availableSeats) {
        console.log(`Seats available: ${availableSeats}`);
        // Add WebSocket or email notification logic here
    }
}
exports.default = SeatAvailabilityObserver;
