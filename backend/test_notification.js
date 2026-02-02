import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import Photographer from './models/Photographer.js';
import { sendReminderEmail } from './utils/emailService.js';

dotenv.config({ path: './backend/.env' });

// FORCE DEV MODE if password is the placeholder
if (process.env.EMAIL_PASS && process.env.EMAIL_PASS.includes('abcd')) {
    console.log("Detected placeholder password. Switching to Ethereal (Dev Mode)...");
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamalpha";

const testNotification = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB.");

        // Define "Tomorrow"
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);

        console.log(`Checking events for date: ${tomorrow.toDateString()}`);

        // Find leads
        const upcomingLeads = await Lead.find({
            eventDate: {
                $gte: tomorrow,
                $lt: dayAfter
            }
        });

        console.log(`Found ${upcomingLeads.length} leads.`);

        if (upcomingLeads.length === 0) {
            console.log("No leads found for tomorrow. Please check the Date set in DB.");
            const allLeads = await Lead.find({});
            console.log("All Leads in DB:", allLeads.map(l => ({ name: l.name, date: l.eventDate })));
        }

        for (const lead of upcomingLeads) {
            console.log(`Processing Lead: ${lead.name}`);
            if (lead.people && lead.people.length > 0) {
                for (const personName of lead.people) {
                    console.log(`  - Checking photographer: '${personName}'`);
                    // Case-insensitive search
                    const photographer = await Photographer.findOne({
                        name: { $regex: new RegExp(`^${personName}$`, 'i') }
                    });

                    if (photographer && photographer.email) {
                        console.log(`    -> Details found: ${photographer.email}`);
                        await sendReminderEmail(
                            photographer.email,
                            photographer.name,
                            lead.name,
                            lead.eventType,
                            lead.eventDate.toDateString(),
                            lead.eventTime || "TBD",
                            lead.eventLocation || "TBD"
                        );
                    } else {
                        console.log(`    -> Photographer not found in DB or has no email!`);
                        const allPhotos = await Photographer.find({});
                        console.log("       Available Photographers:", allPhotos.map(p => p.name));
                    }
                }
            } else {
                console.log("  - No people assigned to this lead.");
            }
        }

        console.log("Done.");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

testNotification();
