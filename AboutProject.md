# Remote Waitlist Manager

**Remote Waitlist Manager** is a full-stack MERN application designed to handle restaurant waitlists efficiently. It allows diners to join a virtual queue, get real-time updates, and check-in when their table is ready. This system replaces traditional manual queues with a digital solution that improves customer experience and streamlines restaurant operations.

![](https://github.com/faria-karim-porna/remote-waitlist-manager/blob/main/video.gif)

---

## Features

- **Virtual Waitlist Management**: 
  - Diners can join a virtual queue, reducing the need for physical waiting.
  - Notifications when a table is ready.
  - Check-in system for efficient table allocation.

- **Dynamic Service Time Management**:
  - Service time is calculated based on party size (hardcoded to 3 seconds per person).
  - Restaurant capacity is hardcoded at 10 seats.

- **Real-Time Updates**: 
  - Send real time updates with `socket.io`.

- **LocalStorage Integration**:
  - LocalStorage is used to maintain session information across multiple browser tabs, ensuring a seamless experience for diners who might switch or reopen tabs during their wait.

- **Testing**:
  - Unit and integration tests using `jest` and `React Testing Library`.

- **Dockerized Environment**: 
  - Easy setup with `Docker`.

---

## Tech Stack

### Frontend:
- `React.js` (with `TypeScript`)
- `Redux Toolkit`
- `Bootstrap`
- `Socket.io` (client)

### Backend:
- `Node.js`
- `Express.js` (with `TypeScript`)
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
     - Updating the database after state changes to maintain consistency.
     - Sending notifications to all registered observers.
     - Detaching all observers when their purpose is fulfilled.
3. **Repository Pattern**:
   - Centralizes data access logic for cleaner code and easier testing.
   - Provides a and consistent way to interact with the database.
4. **Model-View-Controller (MVC) Architecture**:
   - Maintains a clear separation of responsibilities:
     - Models handle data and schema definitions.
     - Controllers manage application logic.
     - Routes define API endpoints.

### Frontend
1. **Separation of Concerns**:
   - Custom hooks improves separation of concerns by encapsulating stateful logic in reusable hooks.
2. **Component-Based Architecture**:
   - Divides UI into small, reusable components for scalability and maintainability.
3. **Redux Toolkit**:
   - Simplifies state management with minimal boilerplate.
4. **Responsive UI**: 
   - Designed with `Bootstrap` for a seamless user experience.

---

## Project Structure

### **Frontend**

```bash
frontend/
├── src/
│   ├── __test__/          # Unit and integration tests for frontend components
│   ├── assets/            # Static assets used in the application
│   │   ├── css/           # Global and component-specific CSS styles
│   │   ├── images/        # Image files (e.g., logos, icons, and backgrounds)
│   │   └── svg/           # SVG files for vector-based graphics
│   ├── components/        # Reusable UI components that build the application
│   │   ├── common/        # Shared components used across multiple features
│   │   ├── core/          # Core components containing essential logic
│   │   │   ├── dataTypes/ # TypeScript interfaces and types for data models
│   │   │   └── redux/     # Redux-related logic for state management
│   │   ├── hooks/         # Custom React hooks for managing reusable stateful logic
│   │   ├── storages/      # Utilities for interacting with browser storage (e.g., LocalStorage)
│   │   └── views/         # View-level components representing different app views
│   ├── App.tsx            # Main application component that defines the overall structure
│   └── main.tsx           # Entry point for React DOM rendering
```

### **Backend**

```bash
backend/
├── src/
│   ├── __test__/          # Unit and integration tests for backend modules
│   ├── config/            # Configuration files for the application (e.g., database setup, socket setup)
│   ├── controllers/       # Handles business logic
│   ├── dataTypes/         # TypeScript interfaces and types for backend entities
│   ├── helpers/           # Utility functions and shared logic
│   ├── models/            # Mongoose schemas for MongoDB collections
│   ├── observers/         # Observer Pattern
│   ├── processors/        # Reusable workflows
│   ├── repositories/      # Data access layer for database operations, implementing the Repository Pattern
│   ├── routes/            # API route definitions, mapping URLs to controller methods
│   ├── services/          # Business service layer for complex operations
│   └── server.ts          # Main server entry point to set up and start the Express.js application
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

## Contact

For queries or suggestions, please reach out to [Faria Karim](mailto:faria.porna.08@gmail.com).
