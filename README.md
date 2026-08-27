# RideMate

RideMate is a premium, high-performance college ride-sharing application built with React Native and Expo. Designed to connect students with reliable transportation options, the platform facilitates both finding and offering rides through a modern, responsive, and intuitive mobile interface.

## Core Features

- Modern Authentication Flow: Seamless and clean login and registration interfaces incorporating robust form validations and visual feedbacks.
- Unified Dashboard: A centralized feed providing quick access to search filters, immediate actions, and dynamically populated nearby ride listings.
- Ride Discovery: Granular search interface allowing users to find optimal routes, times, and vehicle types.
- Ride Offering Form: Streamlined process for drivers to post available seats, vehicle details, and route waypoints.
- Integrated Messaging: In-app communication interface designed with clean chat bubbles to connect drivers with passengers.
- Profile Management: Comprehensive user profile handling containing ride histories, ratings, and intuitive profile picture manipulation.

## Technical Architecture

The application is engineered strictly as a high-fidelity frontend utilizing React Native primitives to ensure maximum performance across iOS and Android platforms.

- Framework: React Native with Expo SDK and Expo Router for file-based navigation.
- Styling: Custom in-house style tokens ensuring a strict adherence to brand guidelines (Royal Blue, Slate Gray) without relying on bloated external CSS frameworks.
- Image Handling: Expo Image Picker integrated for performant local device image manipulation.
- Iconography: Vector iconography powered by Ionicons for scalable resolution-independent graphics.

## Project Structure

The repository is modularized into distinct client and server environments, emphasizing clear separation of concerns:

```text
/            
├── app/                  # Frontend (React Native / Expo Router)
│   ├── _layout.tsx       # Root navigation stack configuration
│   ├── index.jsx         # Authentication entry point
│   ├── register.jsx      # Account creation interface
│   ├── offer-ride.jsx    # Form logic to establish new rides
│   ├── ride-details.jsx  # Comprehensive route and driver details
│   ├── chat.jsx          # Peer-to-peer messaging layout
│   └── (tabs)/
│       ├── _layout.jsx   # Bottom tab navigation configuration
│       ├── index.jsx     # Primary dashboard
│       ├── search.jsx    # Search and filter controls
│       ├── rides.jsx     # Ride history categorization
│       └── profile.jsx   # User configuration panel
│
└── backend/              # Backend Services (Node.js)
    ├── server.js         # Core Express server and API routing logic
    ├── .env              # Backend environment constraints and keys
    └── package.json      # Server dependency definitions
```

## Getting Started

To execute the application locally in a development environment:

1. Clone the repository and navigate into the project directory.
2. Install the necessary dependencies:
   npm install
3. Start the Expo development server:
   npx expo start
4. Access the application on a physical device using Expo Go or via an iOS/Android simulator.

## Design Philosophy

The user interface adheres strictly to a premium, minimalistic design language. Complex component libraries were deliberately excluded in favor of standard React Native primitives. This architectural decision guarantees a lightweight application footprint, fluid responsiveness, and transparent view hierarchies.
