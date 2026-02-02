import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    items: [{
        description: String,
        price: Number
    }],
    total: Number,
    status: { type: String, enum: ['Paid', 'Pending', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
