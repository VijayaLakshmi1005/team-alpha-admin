import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    status: {
        type: String,
        enum: ['New', 'Follow-up', 'Converted', 'Archived'],
        default: 'New'
    },
    eventType: String,
    eventDate: Date,
    followUpDate: Date,
    notes: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    people: [String], // Access for group
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
