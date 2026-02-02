import express from 'express';
import Lead from '../models/Lead.js';
import Gallery from '../models/Gallery.js';
import Task from '../models/Task.js';
import Finance from '../models/Finance.js'; // Assuming this exists or we mock

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const totalPhotos = await Gallery.countDocuments();
        const leadsCount = await Lead.countDocuments();

        // Calculate storage dynamically
        // Assumption: Average photo size = 15MB (High Res RAW/JPEG)
        // Total Limit = 1TB (1024 * 1024 MB = 1,048,576 MB)
        const avgPhotoSizeMB = 15;
        const totalStorageLimitMB = 1048576; // 1 TB
        const usedStorageMB = totalPhotos * avgPhotoSizeMB;
        const usedPercentage = ((usedStorageMB / totalStorageLimitMB) * 100).toFixed(1);

        const storageUsage = `${usedPercentage}%`;

        // Count tasks not done
        const pendingApprovals = await Task.countDocuments({ status: { $ne: 'Completed' } });

        // Mock traffic
        const traffic = '3.2K';

        res.json({
            totalPhotos,
            storageUsage,
            pendingApprovals,
            traffic
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/recent-activity', async (req, res) => {
    try {
        // Fetch recent leads (simulating "deliveries" or recent project updates)
        const leads = await Lead.find().sort({ updatedAt: -1 }).limit(5);

        // Transform to UI format usually expected: name, date, count (mock), status
        const activity = leads.map(lead => ({
            _id: lead._id,
            name: `${lead.eventType || 'Event'} of ${lead.name}`,
            date: new Date(lead.updatedAt).toLocaleDateString(),
            count: `${Math.floor(Math.random() * 500) + 100} photos`, // Mock count
            status: lead.status === 'Converted' ? 'Delivered' : (lead.status === 'New' ? 'Reviewing' : lead.status)
        }));

        res.json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/upcoming-events', async (req, res) => {
    try {
        // Fetch next 5 upcoming events based on eventDate
        const today = new Date();
        const events = await Lead.find({
            eventDate: { $gte: today }
        })
            .sort({ eventDate: 1 })
            .limit(5);

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
