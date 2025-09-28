import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import route files
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import vehicleRoutes from './routes/vehicles.js';
import appointmentRoutes from './routes/appointments.js';
import inventoryRoutes from './routes/inventory.js';
import managerRoutes from './routes/manager.js';
import mechanicRoutes from './routes/mechanic.js';
import feedbackRoutes from './routes/feedback.js';
import reportRoutes from './routes/reports.js';
//import settingsRoutes from './routes/settings.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/mechanic', mechanicRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportRoutes);


// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

