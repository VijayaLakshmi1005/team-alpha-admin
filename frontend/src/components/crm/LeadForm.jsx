import { useState } from "react";
import { X, User, Mail, Phone, Calendar, Tag, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LeadForm({ onClose, onLeadAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Wedding",
    eventDate: "",
    status: "New",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/leads", formData);
      onLeadAdded(response.data);
      toast.success("New luxury inquiry added successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to add lead", err);
      toast.error("Failed to add inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-120 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-ivory flex justify-between items-center bg-ivory/20">
          <div>
            <h2 className="font-serif text-3xl text-charcoal">New Inquiry</h2>
            <p className="text-[10px] text-warmgray mt-2 font-bold uppercase tracking-[0.2em]">Add a new luxury potential client</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-warmgray group transition-all">
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">
                <User size={12} /> Full Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ananya Sharma"
                className="w-full bg-ivory/40 border border-[#e6e3df] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">
                <Mail size={12} /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="client@example.com"
                className="w-full bg-ivory/40 border border-[#e6e3df] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">
                <Phone size={12} /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className="w-full bg-ivory/40 border border-[#e6e3df] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">
                <Tag size={12} /> Event Type
              </label>
              <select
                className="w-full bg-ivory/40 border border-[#e6e3df] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all appearance-none"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option>Wedding</option>
                <option>Pre-Wedding</option>
                <option>Engagement</option>
                <option>Reception</option>
                <option>Fashion Shoot</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">
                <Calendar size={12} /> Preferred Date
              </label>
              <input
                type="date"
                className="w-full bg-ivory/40 border border-[#e6e3df] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">
                <Tag size={12} /> Initial Status
              </label>
              <select
                className="w-full bg-ivory/40 border border-[#e6e3df] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option>New</option>
                <option>Follow-up</option>
                <option>Converted</option>
              </select>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-charcoal text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mutedbrown transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Adding Lead..." : "Save Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
