import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bell, Search, User, Instagram, Menu, MessageCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import AdminProfileModal from "./AdminProfileModal";

export default function Topbar({ onMenuClick }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Persistent profile state could be moved to Context/Redux in future
    const [adminProfile, setAdminProfile] = useState({
        name: "Vijaya Lakshmi S",
        role: "Admin Registry"
    });


    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/crm?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <>
            <header className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-[#e6e3df] bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-ivory rounded-xl transition-all text-charcoal shadow-sm border border-ivory bg-white"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="hidden md:flex items-center max-w-xl relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-warmgray" size={18} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search leads, clients..."
                            className="w-full pl-8 py-2 bg-transparent text-sm focus:outline-none placeholder:text-warmgray/60 font-medium"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden sm:flex items-center gap-4 border-r border-[#e6e3df] pr-6">

                        <button
                            onClick={() => window.open('https://www.instagram.com/teamalpha_crew/', '_blank')}
                            className="text-warmgray hover:text-charcoal transition-all p-2 hover:bg-ivory rounded-full"
                            title="Visit Team Alpha Instagram"
                        >
                            <Instagram size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => window.open('https://wa.me/919110603953', '_blank')}
                            className="text-warmgray hover:text-[#25D366] transition-all p-2 hover:bg-ivory rounded-full"
                            title="Contact Admin via WhatsApp"
                        >
                            <MessageCircle size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div
                        className="flex items-center gap-3 group cursor-pointer"
                        onClick={() => setShowProfileModal(true)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-charcoal">{adminProfile.name}</p>
                            <p className="text-[9px] text-warmgray uppercase tracking-[0.2em] font-bold">{adminProfile.role}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-ivory border border-[#e6e3df] flex items-center justify-center overflow-hidden transition-all group-hover:shadow-md group-hover:scale-105">
                            <User size={24} className="text-warmgray translate-y-1" />
                        </div>
                    </div>
                </div>
            </header>

            {showProfileModal && (
                <AdminProfileModal
                    profile={adminProfile}
                    onClose={() => setShowProfileModal(false)}
                    onSave={(updated) => setAdminProfile(updated)}
                />
            )}
        </>
    );
}
