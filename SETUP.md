# WanderWise Travel Planner Setup Guide

## Overview
WanderWise is now a traditional travel planner website with:
- **Place Cards**: Beautiful cards displaying destinations with ratings, categories, and price ranges
- **Login-Gated Itinerary**: Users must log in to access personalized travel itineraries
- **Days, Budget & Places**: Complete itinerary management with day-by-day planning
- **User Authentication**: Secure login/signup with JWT tokens
- **Responsive Design**: Works on desktop and mobile devices

## Features Implemented

### Backend (Node.js/Express/MongoDB)
- ✅ User authentication with JWT tokens
- ✅ MongoDB models for User, Place, and Itinerary
- ✅ RESTful API endpoints for all operations
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware

### Frontend (React)
- ✅ Login/Signup pages with form validation
- ✅ Protected routes for authenticated users
- ✅ Place cards with interactive selection
- ✅ Dynamic itinerary display with days/budget
- ✅ Responsive navbar with user state
- ✅ Loading states and error handling

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/wanderwise
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

### 2. Seed Database with Sample Places

```bash
cd backend
node seedData.js
```

This will populate your database with sample travel destinations.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_BACKEND_API=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm start
```

## Usage

### For Users
1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Access your personalized dashboard
3. **Browse Places**: View beautiful place cards with ratings and categories
4. **Create Itinerary**: Select places and plan your trip with days and budget
5. **Manage Trips**: View, edit, and organize your travel plans

### For Developers
- **API Endpoints**: All endpoints are documented in the controllers
- **Authentication**: JWT tokens are required for protected routes
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React with Context API for state management

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/authenticate` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Places
- `GET /api/places` - Get all places (with optional filters)
- `GET /api/places/:id` - Get place by ID
- `POST /api/places` - Create new place (protected)

### Itineraries
- `GET /api/itineraries` - Get user's itineraries (protected)
- `GET /api/itineraries/:id` - Get specific itinerary (protected)
- `POST /api/itineraries` - Create new itinerary (protected)
- `PUT /api/itineraries/:id` - Update itinerary (protected)
- `DELETE /api/itineraries/:id` - Delete itinerary (protected)

## Database Schema

### User
- name, email, password (hashed)
- timestamps

### Place
- name, description, image, location
- category (attraction, restaurant, hotel, activity, landmark)
- priceRange (budget, moderate, luxury)
- rating, coordinates

### Itinerary
- title, description, destination
- duration, budget, startDate, endDate
- days array with places and time slots
- user reference, isPublic flag

## Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Frontend
- React 19
- React Router for navigation
- Context API for state management
- CSS3 with responsive design
- React Icons for UI elements

## Development Notes

- The app uses JWT tokens stored in localStorage
- All API calls include proper error handling
- Responsive design works on mobile and desktop
- Loading states provide good user experience
- Form validation prevents invalid submissions

## Next Steps

To extend the application, consider:
- Adding image upload for places
- Implementing real-time collaboration
- Adding social features (sharing itineraries)
- Integrating with external APIs (weather, flights)
- Adding payment processing for bookings
- Implementing admin dashboard
- Adding search and filtering capabilities

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured for frontend URL
2. **Database connection**: Check MongoDB is running and connection string is correct
3. **JWT errors**: Verify JWT_SECRET is set in environment variables
4. **Port conflicts**: Make sure ports 3000 and 5000 are available

### Support
Check the console for error messages and ensure all dependencies are installed correctly.
