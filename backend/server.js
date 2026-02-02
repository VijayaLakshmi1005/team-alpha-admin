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
import invoiceRoutes from './routes/invoiceRoutes.js';
import { startScheduler } from './utils/notificationScheduler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamalpha";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected for Team Alpha Admin");
        // Start the Cron Job Scheduler
        startScheduler();
    })
    .catch(err => console.error("MongoDB Connection Error:", err));

import dashboardRoutes from './routes/dashboardRoutes.js';

/* ... after other route imports ... */

// API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/photographers', photographerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Team Alpha Backend running on port ${PORT}`);
});