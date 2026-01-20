import { useState, useEffect } from "react";
import axios from "axios";
import { X, Mail, Phone, Calendar, Tag, User, Users, Plus, CheckCircle2, MoreVertical, Trash2 } from "lucide-react";
import FollowUpList from "./FollowUpList";
import TaskList from "./TaskList";
import toast from "react-hot-toast";

export default function LeadDetails({ lead: initialLead, onClose }) {
  const [lead, setLead] = useState(initialLead);
  const [teamMembers, setTeamMembers] = useState(initialLead.people || []);
  const [allPhotographers, setAllPhotographers] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPhotographers();
  }, []);

  const fetchPhotographers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/photographers");
      setAllPhotographers(response.data);
    } catch (err) {
      console.error("Failed to fetch photographers", err);
    }
  };

  const addMember = async () => {
    if (selectedPhotographer && !teamMembers.includes(selectedPhotographer)) {
      const newTeam = [...teamMembers, selectedPhotographer];
      setSaving(true);
      try {
        const response = await axios.patch(`http://localhost:5000/api/leads/${lead._id}`, {
          people: newTeam
        });
        setTeamMembers(response.data.people);
        setLead(response.data);
        setSelectedPhotographer("");
        setShowAddMember(false);
        toast.success(`${selectedPhotographer} assigned to this project! Email reminder sent.`);
      } catch (err) {
        console.error("Failed to update team", err);
        toast.error("Failed to assign team member.");
      } finally {
        setSaving(false);
      }
    }
  };

  const removeMember = async (member) => {
    const newTeam = teamMembers.filter(m => m !== member);
    setSaving(true);
    try {
      const response = await axios.patch(`http://localhost:5000/api/leads/${lead._id}`, {
        people: newTeam
      });
      setTeamMembers(response.data.people);
      setLead(response.data);
      toast.success(`${member} removed from project.`);
    } catch (err) {
      console.error("Failed to remove team member", err);
      toast.error("Failed to remove team member.");
    } finally {
      setSaving(false);
    }
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-charcoal/20 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-xl bg-ivory h-screen overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-ivory/80 backdrop-blur-md px-6 md:px-10 py-8 border-b border-[#e6e3df] flex justify-between items-center z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#e6e3df] shadow-sm font-serif text-2xl text-mutedbrown uppercase">
              {lead.name[0]}
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal">{lead.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                  {lead.status}
                </span>
                <span className="text-[9px] text-warmgray uppercase tracking-widest font-bold opacity-60">
                  ID: #{lead._id ? lead._id.slice(-6).toUpperCase() : 'NEW'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white rounded-full transition-all text-warmgray hover:text-charcoal hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-10 space-y-12 flex-1">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm bg-white/50 p-6 rounded-3xl border border-ivory">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-warmgray">
                <Mail size={16} strokeWidth={1.5} />
                <span className="text-charcoal font-medium truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-3 text-warmgray">
                <Phone size={16} strokeWidth={1.5} />
                <span className="text-charcoal font-medium">{lead.phone || "Not provided"}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-warmgray">
                <Tag size={16} strokeWidth={1.5} />
                <span className="text-charcoal font-medium">{lead.eventType || "General Session"}</span>
              </div>
              <div className="flex items-center gap-3 text-warmgray">
                <Calendar size={16} strokeWidth={1.5} />
                <span className="text-charcoal font-medium">
                  {lead.eventDate ? new Date(lead.eventDate).toLocaleDateString() : 'TBD'}
                </span>
              </div>
            </div>
          </div>

          {/* Team Sync Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl flex items-center gap-2">
                <Users size={20} className="text-mutedbrown" />
                Studio Team Sync
              </h3>
              <button
                onClick={() => setShowAddMember(true)}
                className="text-[10px] uppercase font-bold tracking-widest text-mutedbrown hover:text-charcoal transition-colors bg-white px-4 py-2 rounded-full border border-ivory shadow-sm"
              >
                Assign Team
              </button>
            </div>

            {showAddMember && (
              <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                <select
                  className="flex-1 bg-white border border-[#e6e3df] rounded-xl px-4 py-2 text-xs focus:outline-none appearance-none"
                  value={selectedPhotographer}
                  onChange={(e) => setSelectedPhotographer(e.target.value)}
                >
                  <option value="">Select Photographer...</option>
                  {allPhotographers.map(p => (
                    <option key={p._id} value={p.name}>{p.name} ({p.specialty})</option>
                  ))}
                </select>
                <button
                  onClick={addMember}
                  disabled={!selectedPhotographer || saving}
                  className="bg-charcoal text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  {saving ? '...' : 'Add'}
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {teamMembers.length > 0 ? teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white border border-ivory px-4 py-2 rounded-2xl shadow-sm group">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold text-charcoal">{member}</span>
                  <button
                    onClick={() => removeMember(member)}
                    className="text-warmgray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              )) : (
                <p className="text-xs text-warmgray italic">No team members assigned yet.</p>
              )}
            </div>
          </div>

          {/* Workflow Sections */}
          <div className="grid grid-cols-1 gap-10">
            <TaskList leadId={lead._id} tasks={lead.tasks || []} />
            <FollowUpList />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-[#e6e3df] bg-ivory/80 backdrop-blur-md sticky bottom-0">
          <div className="flex gap-4">
            <button className="flex-1 bg-charcoal text-white text-[11px] uppercase tracking-[0.2em] font-bold py-5 rounded-2xl hover:bg-mutedbrown transition-all shadow-xl active:scale-95">
              Generate Invoice
            </button>
            <button className="flex-1 bg-white border border-[#e6e3df] text-charcoal text-[11px] uppercase tracking-[0.2em] font-bold py-5 rounded-2xl hover:bg-ivory transition-all shadow-sm active:scale-95">
              Full Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

