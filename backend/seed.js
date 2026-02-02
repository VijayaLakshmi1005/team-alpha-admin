import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import Photographer from './models/Photographer.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamalpha";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB for Seeding");

        // Check if data exists
        const count = await Lead.countDocuments();
        if (count > 0) {
            console.log("Leads already exist. Skipping seed.");
            // Optional: Update existing leads to have default location/time if missing?
            await Lead.updateMany(
                { eventLocation: { $exists: false } },
                { $set: { eventLocation: "TBD", eventTime: "10:00 AM" } }
            );
            console.log("Updated legacy leads with default Location/Time");
        } else {
            const leads = [
                {
                    name: "Rahul & Priya",
                    email: "rahul.priya@example.com",
                    phone: "+91 98765 43210",
                    eventType: "Wedding",
                    eventDate: new Date("2024-12-15"),
                    eventTime: "10:30 AM",
                    eventLocation: "Taj Hotel, Mumbai",
                    status: "New",
                    people: []
                },
                {
                    name: "Amit's Pre-Wedding",
                    email: "amit.k@example.com",
                    phone: "+91 99887 76655",
                    eventType: "Pre-Wedding",
                    eventDate: new Date("2024-11-20"),
                    eventTime: "04:00 PM",
                    eventLocation: "Lodhi Garden, Delhi",
                    status: "Follow-up",
                    people: []
                }
            ];

            await Lead.insertMany(leads);
            console.log("Seeded 2 Leads");
        }

        // Seed Photographers if needed
        const pCount = await Photographer.countDocuments();
        if (pCount === 0) {
            await Photographer.create({
                name: "Lens Master",
                email: "lens@teamalpha.com",
                phone: "1234567890",
                specialty: "Lead",
                status: "Active"
            });
            console.log("Seeded 1 Photographer");
        }

        console.log("Seeding Complete");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed", err);
        process.exit(1);
    }
};

seedData();
