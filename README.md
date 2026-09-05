# RideMate: A Comprehensive Ride-Sharing Platform
**Academic Project Showcase**

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
</div>

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/book-open.svg" width="24" height="24" align="top" /> Abstract & Problem Statement
With the increase in urban traffic congestion and the need for cost-effective, eco-friendly transit options for college students and commuters, there is a critical demand for peer-to-peer ride-sharing solutions. **RideMate** addresses this by providing a scalable, full-stack mobile application that facilitates seamless connections between drivers offering rides and passengers seeking travel routes. 

This project demonstrates the complete Software Development Life Cycle (SDLC), encompassing UI/UX design, secure user authentication, complex state management, relational data modeling (NoSQL), and real-time interactive mapping.

---

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/share-2.svg" width="24" height="24" align="top" /> System Architecture

The application is built on a robust client-server architecture, ensuring clear separation of concerns, scalability, and maintainability.

*   **Client (Frontend):** Developed using **React Native** and the **Expo** framework. It utilizes **Expo Router** for file-based navigation, ensuring a deeply linked and fluid mobile experience.
*   **Server (Backend):** A RESTful API built with **Node.js** and **Express.js**. It handles business logic, data validation, and secure communication with the client.
*   **Database:** A **MongoDB** (NoSQL) database accessed via **Mongoose**. The schema design mimics relational behaviors by utilizing `ObjectId` references to link Users, Rides, Messages, and Notifications.

---

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/database.svg" width="24" height="24" align="top" /> Database Schema & Data Modeling

The system utilizes highly structured Mongoose models with rigorous validation schemas to maintain data integrity.

- **User Model:** Stores credentials with hashed passwords (`bcryptjs`). Serves as the primary entity referenced by all other models.
- **Ride Model:** Handles complex location sub-schemas for both text-based and coordinate-based (Latitude/Longitude) origins and destinations. Maintains state for `availableSeats`, pricing, and an array of `passengers` (User references).
- **Message Model:** Enforces a strict two-way chat system. Every message is scoped relationally to a specific `Ride ID`, a `Sender ID`, and a `Receiver ID`, ensuring data privacy and scoped communication.
- **Notification Model:** Handles real-time localized alerts for ride updates and application events.

---

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/lock.svg" width="24" height="24" align="top" /> Security & Technical Achievements

1. **Secure Authentication & Authorization:**
   - Implemented **JSON Web Tokens (JWT)** for stateless, secure API communication.
   - Employed `bcryptjs` for one-way password hashing before database insertion.
   - Protected API routes using custom middleware that validates headers and user identity prior to processing requests.

2. **Complex State Management & Concurrency:**
   - Handled complex backend logic to prevent race conditions (e.g., verifying `availableSeats` > 0 before successfully pushing a user `ObjectId` to the Ride model's passenger array).
   
3. **Interactive Map & Geolocation:**
   - Integrated `react-native-maps` and `expo-location` to reverse-geocode and plot precise pickup/drop-off points dynamically via map markers.

4. **Bi-directional Scoped Messaging:**
   - Engineered a custom database querying logic that loads messages strictly based on the intersection of a driver, a passenger, and a specific trip, mimicking complex SQL `JOIN` functionalities in a NoSQL environment.

---

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cpu.svg" width="24" height="24" align="top" /> Technology Stack

### Frontend (User Interface)
- **Framework:** ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Expo](https://img.shields.io/badge/Expo-1B1F23?style=flat-square&logo=expo&logoColor=white) 
- **Mapping:** `react-native-maps`, `expo-location`
- **Native APIs:** `expo-image-picker` (Profile media), `expo-haptics` (Tactile feedback)
- **Local Cache:** `AsyncStorage` 

### Backend (REST API)
- **Runtime Environment:** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
- **Database:** ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white) Mongoose ORM
- **Security:** `jsonwebtoken`, `bcryptjs`, `cors`
- **Environment Management:** `dotenv`

---

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/folder-tree.svg" width="24" height="24" align="top" /> Project Structure

```text
RideMate/
├── backend/                  # RESTful API Services
│   ├── config/               # Database connection scripts & environment config
│   ├── models/               # Mongoose Schemas (User, Ride, Message, Notification)
│   ├── routes/               # Express API endpoints
│   └── server.js             # Core server entry point
├── frontend/                 # React Native Application
│   ├── app/                  # File-based routing (Expo Router)
│   │   ├── (tabs)/           # Main dashboard UI
│   │   ├── _layout.tsx       # Root Navigation Stack
│   │   ├── chat.jsx          # Scoped messaging UI
│   │   ├── map-picker.jsx    # Interactive geolocation picker
│   │   └── offer/ride.jsx    # Complex forms for ride generation
│   ├── components/           # Reusable UI primitives
│   └── utils/                # Helper functions & API connectors
└── README.md                 # Project Documentation
```

---

## <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/terminal.svg" width="24" height="24" align="top" /> Installation & Local Execution

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is properly configured with MONGO_URI and JWT_SECRET
npm run dev
```
*The backend will boot on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
*Use the **Expo Go** application on your physical device or an iOS/Android emulator to scan the generated QR code and test the platform.*
