import { useState } from "react";
import { Phone, Mail, Calendar, Clock, CheckCircle, Plus, MessageCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

export default function FollowUpList({ lead, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleSetFollowUp = async (days) => {
    setLoading(true);
    const nextDate = addDays(new Date(), days);

    try {
      // Update Lead Status to Follow-up and set date
      const response = await axios.patch(`http://localhost:5000/api/leads/${lead._id}`, {
        status: 'Follow-up',
        followUpDate: nextDate
      });

      if (onUpdate) onUpdate(response.data);
      toast.success(`Follow-up scheduled for ${format(nextDate, 'MMM dd')}`);
    } catch (err) {
      console.error("Failed to update follow-up", err);
      toast.error("Error updating follow-up");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async () => {
    if (!window.confirm("Mark follow-up as done? This will clear the date.")) return;

    setLoading(true);
    try {
      const response = await axios.patch(`http://localhost:5000/api/leads/${lead._id}`, {
        followUpDate: null,
        // Optionally keep status or set to specific status? Let's keep status.
      });
      if (onUpdate) onUpdate(response.data);
      toast.success("Follow-up marked as completed");
    } catch (err) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e6e3df] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
          <Clock size={20} className="text-mutedbrown" />
          Next Follow-Up
        </h3>
        {lead.followUpDate && (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
            Scheduled
          </span>
        )}
      </div>

      <div className="space-y-6">
        {lead.followUpDate ? (
          <div className="bg-ivory/30 p-4 rounded-2xl border border-ivory flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-mutedbrown shadow-sm border border-[#e6e3df]">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-sm">{format(new Date(lead.followUpDate), 'PPPP')}</h4>
                <p className="text-xs text-warmgray mt-0.5">Scheduled Reminder</p>
              </div>
            </div>
            <button
              onClick={handleMarkDone}
              disabled={loading}
              className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-all"
              title="Mark as Done"
            >
              <CheckCircle size={24} />
            </button>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-400 italic mb-4">No follow-up scheduled.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleSetFollowUp(3)}
                disabled={loading}
                className="text-[10px] font-bold uppercase tracking-widest bg-charcoal text-white px-4 py-2 rounded-xl hover:bg-mutedbrown transition-all"
              >
                +3 Days
              </button>
              <button
                onClick={() => handleSetFollowUp(7)}
                disabled={loading}
                className="text-[10px] font-bold uppercase tracking-widest bg-white border border-ivory text-charcoal px-4 py-2 rounded-xl hover:bg-ivory transition-all"
              >
                +1 Week
              </button>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-ivory">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-warmgray mb-4">Engagement Options</h4>
          <div className="grid grid-cols-3 gap-3">
            <a
              href={lead.phone ? `tel:${lead.phone}` : '#'}
              onClick={e => !lead.phone && toast.error("No phone number available")}
              className={`flex flex-col items-center justify-center gap-2 py-3 border border-ivory rounded-xl text-xs font-bold transition-all ${lead.phone ? 'bg-white text-charcoal hover:bg-ivory' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
            >
              <Phone size={16} /> <span className="text-[10px] uppercase">Call</span>
            </a>
            <a
              href={lead.email ? `mailto:${lead.email}` : '#'}
              onClick={e => !lead.email && toast.error("No email available")}
              className={`flex flex-col items-center justify-center gap-2 py-3 border border-ivory rounded-xl text-xs font-bold transition-all ${lead.email ? 'bg-white text-charcoal hover:bg-ivory' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
            >
              <Mail size={16} /> <span className="text-[10px] uppercase">Email</span>
            </a>
            <button
              onClick={() => {
                if (lead.phone) {
                  const message = `Hello ${lead.name}, regarding your upcoming ${lead.eventType} event...`;
                  window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                } else {
                  toast.error("No phone number for WhatsApp");
                }
              }}
              className={`flex flex-col items-center justify-center gap-2 py-3 border border-ivory rounded-xl text-xs font-bold transition-all ${lead.phone ? 'bg-white text-[#25D366] hover:bg-green-50' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
            >
              <MessageCircle size={16} /> <span className="text-[10px] uppercase">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
