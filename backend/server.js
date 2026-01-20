import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Models for global access if needed
import './models/Lead.js';
import './models/Gallery.js';
import './models/Finance.js';
import './models/Event.js';
import './models/Task.js';

// Route Imports
import leadRoutes from './routes/leadroutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import photographerRoutes from './routes/photographerRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamalpha";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected for Team Alpha Admin"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/photographers', photographerRoutes);
app.use('/api/tasks', taskRoutes);

// Dashboard Stats endpoint
import Lead from './models/Lead.js';
import Gallery from './models/Gallery.js';

app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const totalPhotos = await Gallery.countDocuments();
        const leadsCount = await Lead.countDocuments();
        const pendingApprovals = 14; // Mock or calculate from a specific model if exists
        const traffic = '3.2K'; // Mock stats

        res.json({
            totalPhotos: totalPhotos || 12480,
            storageUsage: '82%',
            pendingApprovals,
            traffic
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Team Alpha Backend running on port ${PORT}`);
});