import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckSquare, Users } from "lucide-react";
import LeadDetails from "../components/crm/LeadDetails";
import LeadForm from "../components/crm/LeadForm";
import InvoiceForm from "../components/crm/InvoiceForm";
import TaskList from "../components/crm/TaskList";
import PhotographerList from "../components/crm/PhotographerList";
import { Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function CRM() {
  const [activeTab, setActiveTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/leads");
      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch leads", err);
      setLoading(false);
    }
  };

  const deleteLead = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        setLeads(leads.filter(lead => lead._id !== id));
        toast.success("Lead archived/deleted successfully");
      } catch (err) {
        console.error("Failed to delete lead", err);
        toast.error("Failed to delete lead");
      }
    }
  };

  const handleLeadAdded = (newLead) => {
    setLeads([newLead, ...leads]);
    setShowLeadForm(false);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 md:space-y-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">CRM</h1>
          <p className="text-sm text-warmgray mt-1">Nurturing relationships, capturing stories.</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'invoices') setShowInvoiceForm(true);
            else if (activeTab === 'team') setShowLeadForm(false); // We'll handle photographer add via list
            else setShowLeadForm(true);
          }}
          className={`w-full md:w-auto flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-mutedbrown transition-all shadow-xl active:scale-95 ${activeTab === 'team' ? 'hidden' : ''}`}
        >
          <Plus size={16} />
          {activeTab === 'invoices' ? 'New Invoice' : 'Add New Lead'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 md:gap-10 border-b border-[#e6e3df] overflow-x-auto no-scrollbar">
        {[
          { id: 'leads', name: 'Leads', icon: Users },
          { id: 'invoices', name: 'Invoices', icon: FileText },
          { id: 'tasks', name: 'Tasks & Planning', icon: CheckSquare },
          { id: 'team', name: 'Photographers', icon: UserPlus },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-charcoal' : 'text-warmgray hover:text-charcoal'
              }`}
          >
            <tab.icon size={14} />
            {tab.name}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content based on Tab */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-[#e6e3df]/40 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-[#f0f0f0] flex flex-col md:flex-row items-center justify-between gap-4 bg-ivory/10">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warmgray" size={16} />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#e6e3df] rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-mutedbrown shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none flex items-center justify-center gap-2 px-8 py-3 bg-white border border-[#e6e3df] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-warmgray hover:text-charcoal transition-all shadow-sm focus:outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                  </select>
                  <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-warmgray" />
                </div>
              </div>
              <div className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-warmgray bg-ivory/50 px-4 py-2 rounded-full">
                {leads.length} Active Leads
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-ivory text-[10px] uppercase tracking-widest text-warmgray">
                    <th className="px-8 py-6 font-bold">Client Profile</th>
                    <th className="px-8 py-6 font-bold hidden md:table-cell">Status</th>
                    <th className="px-8 py-6 font-bold hidden lg:table-cell">Inquiry Date</th>
                    <th className="px-8 py-6 font-bold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory text-sm">
                  {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-ivory/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-ivory text-mutedbrown rounded-2xl flex items-center justify-center font-serif text-xl border border-transparent group-hover:bg-charcoal group-hover:text-white transition-all shadow-sm">
                            {lead.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal text-base">{lead.name}</div>
                            <div className="text-[11px] text-warmgray mt-0.5">{lead.email}</div>
                            <div className="md:hidden mt-2">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                lead.status === 'Follow-up' ? 'bg-amber-50 text-amber-600' :
                                  'bg-green-50 text-green-600'
                                }`}>
                                {lead.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                          lead.status === 'Follow-up' ? 'bg-amber-50 text-amber-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 hidden lg:table-cell text-xs text-warmgray font-medium italic">
                        {new Date(lead.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => deleteLead(lead._id, e)}
                            className="text-warmgray hover:text-red-500 p-3 rounded-full hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="text-warmgray hover:text-charcoal p-3 rounded-full hover:bg-white transition-all shadow-sm hover:shadow-md">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40">
                          <Users size={48} strokeWidth={1} />
                          <p className="font-serif italic text-lg text-warmgray">Searching for the next premium inquiry...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="max-w-4xl mx-auto px-2">
            <InvoiceForm onClose={() => setActiveTab('leads')} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="max-w-4xl mx-auto">
            <TaskList />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PhotographerList />
          </div>
        )}
      </div>

      {/* Forms & Modals */}
      {showLeadForm && (
        <LeadForm
          onClose={() => setShowLeadForm(false)}
          onLeadAdded={handleLeadAdded}
        />
      )}

      {showInvoiceForm && (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-120 flex items-center justify-center p-4">
          <InvoiceForm onClose={() => setShowInvoiceForm(false)} />
        </div>
      )}

      {/* Side Panel for Lead Details */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
