import express from 'express';
import Finance from '../models/Finance.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const data = await Finance.find().sort({ date: -1 });
    res.json(data);
});

router.post('/', async (req, res) => {
    const entry = new Finance(req.body);
    await entry.save();
    res.json(entry);
});

router.get('/overview', async (req, res) => {
    // Mock overview for sales/profit
    res.json({
        annualSales: '₹ 42.5L',
        annualProfit: '₹ 29.7L',
        expenses: '₹ 12.8L'
    });
});

export default router;
