import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, enum: ['new', 'alert', 'success', 'info'], default: 'info' },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // optional link to navigate to
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
