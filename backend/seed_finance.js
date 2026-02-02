import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Finance from './models/Finance.js';
import Invoice from './models/Invoice.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/teamalpha";

const seedFinance = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB for Finance Seeding");

        // Clear existing finance data to avoid duplicates if re-run (optional, but safe for dev)
        await Finance.deleteMany({});
        await Invoice.deleteMany({});
        console.log("Cleared existing Finance/Invoice data");

        // const invoiceCount = await Invoice.countDocuments();
        // const financeCount = await Finance.countDocuments();

        if (true) {
            // Seed Invoices (Income)
            const invoices = [
                {
                    clientName: "Rahul & Priya Wedding",
                    items: [{ description: "Full Wedding Package", amount: 150000 }],
                    total: 150000,
                    status: "Paid",
                    invoiceDate: new Date("2024-12-20"),
                    dueDate: new Date("2024-12-20")
                },
                {
                    clientName: "Amit's Pre-Wedding",
                    items: [{ description: "Pre-Wedding Shoot", amount: 45000 }],
                    total: 45000,
                    status: "Paid",
                    invoiceDate: new Date("2025-01-05"),
                    dueDate: new Date("2025-01-05")
                },
                {
                    clientName: "Corporate Event - TechCorp",
                    items: [{ description: "Event Coverage", amount: 85000 }],
                    total: 85000,
                    status: "Pending",
                    invoiceDate: new Date("2025-01-15"),
                    dueDate: new Date("2025-01-30")
                }
            ];

            await Invoice.insertMany(invoices);
            console.log("Seeded Invoices");

            // Seed Expenses
            const expenses = [
                {
                    type: "expense",
                    amount: 85000,
                    category: "Equipment",
                    description: "Sony A7S III Kit",
                    date: new Date("2024-12-10"),
                    status: "Paid"
                },
                {
                    type: "expense",
                    amount: 25000,
                    category: "Travel",
                    description: "Flight to Udaipur",
                    date: new Date("2024-12-14"),
                    status: "Paid"
                },
                {
                    type: "expense",
                    amount: 12000,
                    category: "Marketing",
                    description: "Instagram Ads Dec",
                    date: new Date("2024-12-01"),
                    status: "Paid"
                },
                {
                    type: "expense",
                    amount: 45000,
                    category: "Salary",
                    description: "Editor Salary - Jan",
                    date: new Date("2025-01-01"),
                    status: "Paid"
                },
                {
                    type: "expense",
                    amount: 5000,
                    category: "Operational",
                    description: "Studio Utilities",
                    date: new Date("2025-01-05"),
                    status: "Paid"
                }
            ];

            await Finance.insertMany(expenses);
            console.log("Seeded Expenses");
        } else {
            console.log("Finance data already exists. Skipping.");
        }

        console.log("Finance Seeding Complete");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed", err);
        process.exit(1);
    }
};

seedFinance();
