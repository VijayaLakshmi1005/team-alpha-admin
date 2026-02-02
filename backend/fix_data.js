import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import Photographer from './models/Photographer.js';

dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamalpha";

const fixData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB.");

        // 1. Create or Find Photographer
        const photogName = "Vijayalakshmi";
        let photographer = await Photographer.findOne({ name: photogName });
        if (!photographer) {
            photographer = await Photographer.create({
                name: photogName,
                email: "vijayalakshmi200510@gmail.com", // Test email
                phone: "7204058683",
                specialty: "Lead",
                status: "Active"
            });
            console.log("Created Photographer:", photogName);
        } else {
            console.log("Photographer exists:", photogName);
        }

        // 2. Update Lead "VIJAYA LAKSHMI S" or create new
        // Calculate "Tomorrow"
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Tomorrow

        // Find any lead or create one
        let lead = await Lead.findOne({});
        if (!lead) {
            lead = new Lead({
                name: "Test Wedding",
                email: "test@example.com",
                status: "New"
            });
        }

        lead.eventDate = tomorrow;
        lead.eventTime = "10:30 AM";
        lead.eventLocation = "Mumbai";
        lead.people = [photogName]; // Assign the photographer
        await lead.save();

        console.log(`Updated Lead '${lead.name}' with Date: ${tomorrow.toDateString()} and Team: ${lead.people}`);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

fixData();
