const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors middleware
const homeworkRoutes = require('./routes/HomeworkRoutes'); // Import homework-related routes
const authRoutes = require('./routes/authRoutes'); // Import authRoutes

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors()); // Allow all origins by default

// Alternatively, restrict CORS to specific origins (for production):
// app.use(cors({ origin: "http://localhost:3000" })); // Replace with your frontend URL

// Routes
app.use('/api/homework', homeworkRoutes); // Homework-related routes
app.use('/api/auth', authRoutes);  // Authentication-related routes

// Default route for '/'
app.get('/', (req, res) => {
    res.send('Welcome to the Backend Server!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
