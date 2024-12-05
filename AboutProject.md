# Remote Waitlist Manager

**Remote Waitlist Manager** is a full-stack MERN application designed to handle restaurant waitlists efficiently. It allows diners to join a virtual queue, get real-time updates, and check-in when their table is ready. This system replaces traditional manual queues with a digital solution that improves customer experience and streamlines restaurant operations.

---

## Features

- **Virtual Waitlist Management**: 
  - Diners can join a virtual queue, reducing the need for physical waiting.
  - Notifications when a table is ready.
  - Check-in system for efficient table allocation.

- **Real-Time Updates**: 
  - Powered by the **Observer Pattern** with `socket.io`.

- **Service Time Management**:
  - Service time is calculated based on party size (hardcoded to 3 seconds per person).
  - Restaurant capacity is hardcoded at 10 seats.

- **Scalable Architecture**: 
  - **Template Method Pattern** for reusable workflows such as adding observers, sending notifications, detaching all observers, and updating the database.
  - **Repository Pattern** for clean and consistent database interactions.
  - Custom hooks and components in the frontend for modularity.

---

## Tech Stack

### Frontend:
- `React.js` (with `TypeScript`)
- `Redux Toolkit`
- `Bootstrap`

### Backend:
- `Node.js`
- `Express.js`
- `MongoDB` (with `Mongoose`)
- `Socket.io`

### Testing:
- `Jest`
- `React Testing Library`
- `MongoDB Memory Server`

### Deployment and Development:
- `Docker`

---

## Design Patterns and Architecture

### Backend
1. **Observer Pattern**:
   - Ensures diners are notified in real-time when their table is ready via `socket.io`.
   - Updates the database simultaneously to reflect the state change.

2. **Template Method Pattern**:
   - Provides a structured way to handle reusable workflows, including:
     - Adding observers to the notification list.
     - Sending notifications to all registered observers.
     - Detaching all observers when their purpose is fulfilled.
     - Updating the database after state changes to maintain consistency.

3. **Repository Pattern**:
   - Centralizes data access logic for cleaner code and easier testing.

4. **MVC Architecture**:
   - Maintains a clear separation of responsibilities:
     - Models handle data and schema definitions.
     - Controllers manage application logic.
     - Routes define API endpoints.

### Frontend
1. **Component-Based Architecture**:
   - Modular components enable scalable and maintainable UI development.

2. **Custom Hooks**:
   - Encapsulate stateful logic, improving separation of concerns and reusability.

3. **Redux Toolkit**:
   - Simplifies state management with minimal boilerplate.

---

## Project Structure

### **Frontend**

```bash
frontend/
├── src/
│   ├── __test__/
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── svg/
│   ├── components/ # Reusable UI components (e.g., WaitlistForm, PartyList)
│   │   ├── common/
│   │   ├── core/
│   │   │   ├── dataTypes/
│   │   │   └── redux/
│   │   ├── common/
│   │   ├── hooks/ # Custom React hooks for stateful logic
│   │   ├── storages/
│   │   └── views/ # View-level components (e.g., HomePage, WaitlistPage)
│   ├── App.tsx # Main application entry
│   └── main.tsx # React DOM entry point
```

### **Backend**

```bash
backend/
├── src/
│   ├── __test__/
│   ├── config/
│   ├── controllers/ # Handles business logic (e.g., waitlist processing)
│   ├── dataTypes/
│   ├── helpers/ # Utility functions and shared logic
│   ├── models/ # Mongoose schemas for MongoDB
│   ├── observers/ # Real-time notification handlers
│   ├── processors/ # Reusable workflows (e.g., service time calculation, notification handling)
│   ├── repositories/ # Data access logic using Repository Pattern
│   ├── routes/ # API route definitions
│   ├── services/
│   └── server.ts # Main server entry point
```

---

## Installation and Setup

### Prerequisites

Ensure the following tools are installed:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional for containerized setup)

---

### **Setup Without Docker**

1. **Clone the repository**:
    ```bash
    git clone https://github.com/faria-karim-porna/remote-waitlist-manager.git
    cd remote-waitlist-manager
    ```

2. **Install dependencies**:
    - For backend:
      ```bash
      cd backend
      npm install
      ```
    - For frontend:
      ```bash
      cd frontend
      npm install
      ```

3. **Configure Environment Variables**:
    - Backend:
      Create a `.env` file in the `backend` directory with the following variables:
      ```env
      PORT=5000
      MONGO_URI=<your_mongodb_connection_string>
      ```
    - Frontend:
      No specific configuration is required unless using custom APIs.

4. **Run the application**:
    - Start the backend:
      ```bash
      cd backend
      npm run start-dev
      ```
    - Start the frontend:
      ```bash
      cd frontend
      npm run dev
      ```

5. **Access the application**:
    - Open the browser and navigate to `http://localhost:5173`.

---

### **Setup With Docker**

1. **Clone the repository**:
    ```bash
    git clone https://github.com/faria-karim-porna/remote-waitlist-manager.git
    cd remote-waitlist-manager
    ```

2. **Build and Run Containers**:
    ```bash
    docker compose up
    ```

3. **Access the application**:
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:5000`

4. **Stopping the Containers**:
    ```bash
    docker compose down
    ```

---

## Testing

1. **Run Backend Tests**:
    ```bash
    cd backend
    npm test
    ```

2. **Run Frontend Tests**:
    ```bash
    cd frontend
    npm test
    ```

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Contact

For queries or suggestions, please reach out to [Faria Karim](mailto:faria.porna.08@gmail.com).
