import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import Photographer from './models/Photographer.js';

dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/team-alpha";

const checkDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        const leads = await Lead.find({});
        console.log("\n--- LEADS IN DATABASE (" + leads.length + ") ---");
        leads.forEach(l => {
            console.log(`- ${l.name} <${l.email}> (${l.status}) | Date: ${l.eventDate ? l.eventDate.toDateString() : 'N/A'} | Loc: ${l.eventLocation || 'N/A'}`);
        });

        const photographers = await Photographer.find({});
        console.log("\n--- PHOTOGRAPHERS IN DATABASE (" + photographers.length + ") ---");
        photographers.forEach(p => {
            console.log(`- ${p.name} (${p.specialty}) | Phone: ${p.phone}`);
        });

        console.log("\n-------------------------------------------");
        process.exit(0);
    } catch (err) {
        console.error("Error connecting to DB:", err);
        process.exit(1);
    }
};

checkDB();
