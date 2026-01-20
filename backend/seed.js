import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Gallery from './models/Gallery.js';
import Finance from './models/Finance.js';
import Event from './models/Event.js';
import Task from './models/Task.js';
import Photographer from './models/Photographer.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamalpha";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Seeding Team Alpha Database...");

        // Clean all
        await Lead.deleteMany({});
        await Gallery.deleteMany({});
        await Finance.deleteMany({});
        await Event.deleteMany({});
        await Task.deleteMany({});
        await Photographer.deleteMany({});

        // 1. Leads
        const lead1 = await Lead.create({
            name: "Ananya Sharma",
            email: "ananya@example.com",
            phone: "+91 98765 43210",
            status: "New",
            eventType: "Wedding",
            eventDate: new Date("2026-04-12"),
            notes: "Traditional Hindu wedding at Taj Palace."
        });

        const lead2 = await Lead.create({
            name: "Rahul & Priya",
            email: "rahul.mehta@example.com",
            phone: "+91 91106 03953",
            status: "Follow-up",
            eventType: "Pre-Wedding",
            eventDate: new Date("2026-02-20"),
            followUpDate: new Date("2026-01-25")
        });

        // 1.5 Photographers
        await Photographer.create([
            { name: "Sreenidhi", email: "sreenidhi@teamalpha.com", phone: "+91 91106 03953", specialty: "Lead", status: "Active" },
            { name: "Amit Kumar", email: "amit@teamalpha.com", phone: "+91 98765 43211", specialty: "Second", status: "Active" },
            { name: "Vikram Singh", email: "vikram@teamalpha.com", phone: "+91 98765 43212", specialty: "Video", status: "Active" },
        ]);

        // 2. Tasks
        await Task.create({ title: "Send wedding quotation", lead: lead1._id });
        await Task.create({ title: "Confirm Jaipur venue for pre-wedding", lead: lead2._id });

        // 3. Gallery
        await Gallery.create({
            albumName: "The Grand Wedding 2025",
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            isFavorite: true
        });
        await Gallery.create({
            albumName: "The Grand Wedding 2025",
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
            isFavorite: false
        });

        // 4. Finance
        await Finance.create({ type: 'income', amount: 150000, category: 'Wedding Session', status: 'Received' });
        await Finance.create({ type: 'expense', amount: 25000, category: 'Equipment Rental', status: 'Paid' });

        // 5. Events
        await Event.create({
            title: "Wedding: Ananya & Rahul",
            start: new Date("2026-04-12T09:00:00"),
            end: new Date("2026-04-12T23:00:00"),
            lead: lead1._id,
            location: "Taj Palace, Mumbai"
        });

        console.log("Database seeded successfully with SOP compliant data!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
