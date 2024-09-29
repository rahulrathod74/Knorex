// server.js (Entry point)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'; // Routes for user operations

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fullstackApp', {
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error", err));

// Routes
app.use('/api/users', userRoutes);



// Start the server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
