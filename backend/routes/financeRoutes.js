import express from 'express';
import Finance from '../models/Finance.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// Get Finance Overview (Stats)
router.get('/overview', async (req, res) => {
    try {
        // Calculate Total Sales (Sum of Paid Invoices)
        const paidInvoices = await Invoice.find({ status: 'Paid' });
        const annualSales = paidInvoices.reduce((sum, process) => sum + (process.total || 0), 0);

        // Calculate Total Expenses (Sum of Finance type 'expense')
        const expensesData = await Finance.find({ type: 'expense' });
        const totalExpenses = expensesData.reduce((sum, item) => sum + (item.amount || 0), 0);

        // Calculate Profit
        const annualProfit = annualSales - totalExpenses;

        res.json({
            annualSales,
            annualProfit,
            expenses: totalExpenses
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Treasury Allocation (Expenses by Category)
router.get('/allocation', async (req, res) => {
    try {
        const aggregation = await Finance.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }
        ]);

        const allCategories = ['Operational', 'Equipment', 'Travel', 'Marketing', 'Salary', 'Invoice Payment'];
        const totalExpenses = aggregation.reduce((sum, item) => sum + item.total, 0);

        const formatted = allCategories.map(cat => {
            const found = aggregation.find(item => item._id === cat);
            const value = found ? found.total : 0;
            return {
                label: cat,
                value: value,
                progress: totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
                color: getColorForCategory(cat)
            };
        });

        // Sort by value desc so biggest are first
        formatted.sort((a, b) => b.value - a.value);

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function getColorForCategory(category) {
    const map = {
        'Equipment': 'bg-emerald-600',
        'Travel': 'bg-blue-600',
        'Marketing': 'bg-amber-500',
        'Operational': 'bg-slate-500',
        'Salary': 'bg-rose-500',
        'Invoice Payment': 'bg-purple-600'
    };
    return map[category] || 'bg-gray-400';
}

// Add Generic Finance Entry
router.post('/', async (req, res) => {
    try {
        const entry = new Finance(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Recent Transactions (Combined Invoices & Expenses)
router.get('/transactions', async (req, res) => {
    try {
        // Fetch last 5 invoices (Paid or Pending)
        const recentInvoices = await Invoice.find()
            .sort({ invoiceDate: -1 })
            .limit(5)
            .lean();

        // Fetch last 5 expenses
        const recentExpenses = await Finance.find({ type: 'expense' })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        // Combine and sort
        const transactions = [
            ...recentInvoices.map(inv => ({
                id: inv._id,
                name: inv.clientName,
                category: 'Invoice Payment',
                amount: inv.total,
                date: inv.invoiceDate,
                type: 'income',
                status: inv.status || 'Pending'
            })),
            ...recentExpenses.map(exp => ({
                id: exp._id,
                name: exp.category || 'Expense',
                category: exp.description || 'Operational Expense',
                amount: exp.amount,
                date: exp.date,
                type: 'expense',
                status: exp.status || 'Paid'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add New Expense
// Add New Expense
router.post('/expense', async (req, res) => {
    try {
        const { title, amount, category, date, status } = req.body;
        const entry = new Finance({
            type: 'expense',
            amount,
            category: category, // Correctly map category to category
            description: title, // Map title to description
            date: date || new Date(),
            status: status || 'Paid'
        });
        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Expense
router.put('/expense/:id', async (req, res) => {
    try {
        const { title, amount, category, date, status } = req.body;
        const updated = await Finance.findByIdAndUpdate(
            req.params.id,
            { category: category, amount, description: title, date, status }, // Correctly map fields
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Expense
router.delete('/expense/:id', async (req, res) => {
    try {
        await Finance.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Payment Plans (Pending Invoices)
router.get('/pending-payments', async (req, res) => {
    try {
        const pending = await Invoice.find({ status: { $ne: 'Paid' } }).sort({ invoiceDate: 1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
