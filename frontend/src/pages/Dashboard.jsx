import { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "../components/dashboard/StatCard";
import { TrendingUp, Users, ImageIcon, PieChart, ArrowUpRight, Clock, MapPin } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    storageUsage: '0%',
    pendingApprovals: 0,
    traffic: '0'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">Registry Overview</h1>
          <p className="text-[10px] md:text-xs text-warmgray mt-3 font-bold uppercase tracking-[0.4em]">Team Alpha Luxury Photography Studio</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-ivory text-[10px] font-bold uppercase tracking-widest text-warmgray shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Studio System Online
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Global Photo Assets"
          value={stats.totalPhotos.toLocaleString()}
          icon={<ImageIcon size={20} className="text-mutedbrown" />}
        />
        <StatCard
          title="Cloud Storage"
          value={stats.storageUsage}
          icon={<PieChart size={20} className="text-mutedbrown" />}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<Clock size={20} className="text-mutedbrown" />}
        />
        <StatCard
          title="Website Traffic"
          value={stats.traffic}
          icon={<Users size={20} className="text-mutedbrown" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity section */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-12 border border-ivory shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-ivory/40 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-beige/40 transition-all duration-1000"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <h2 className="font-serif text-2xl md:text-3xl">Latest Deliveries</h2>
              <button className="text-[10px] font-bold uppercase tracking-widest text-mutedbrown hover:text-charcoal border-b border-[#e6e3df] hover:border-charcoal transition-all pb-2">
                All Registry Assets
              </button>
            </div>

            <div className="space-y-10">
              {[
                { name: "Wedding of Ananya & Rahul", date: "2 hours ago", count: "450 photos", status: "Delivered" },
                { name: "Engagement: Megha & Vikram", date: "Yesterday", count: "120 photos", status: "Reviewing" },
                { name: "Pre-Wedding: Priya & Rahul", date: "3 days ago", count: "210 photos", status: "Delivered" },
              ].map((session, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-10 border-b border-ivory/60 last:border-0 last:pb-0 group/item">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-ivory/50 rounded-3xl flex items-center justify-center text-warmgray group-hover/item:bg-charcoal group-hover/item:text-white transition-all duration-700 shadow-sm">
                      <ImageIcon size={28} strokeWidth={1} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-charcoal">{session.name}</h4>
                      <p className="text-[11px] text-warmgray mt-1 font-bold uppercase tracking-wider">{session.date} • {session.count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${session.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {session.status}
                    </span>
                    <button className="p-3 border border-ivory rounded-full text-warmgray hover:text-charcoal hover:bg-white hover:shadow-md transition-all">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Studio Calendar View */}
        <div className="bg-charcoal text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-white/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="font-serif text-2xl md:text-3xl mb-12">Weekly Registry</h3>
            <div className="space-y-10 flex-1">
              {[1, 2].map(i => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">
                      {i === 1 ? 'Jan 16, 2026' : 'Jan 22, 2026'}
                    </span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-3xl rounded-4xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer group/card active:scale-[0.98]">
                    <h4 className="text-base font-bold group-hover/card:text-gold transition-colors">
                      {i === 1 ? 'Taj Palace: Mumbai Core' : 'Heritage Pre-Wedding | Jaipur'}
                    </h4>
                    <div className="flex flex-col gap-3 mt-6 text-[11px] text-white/60 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                          <Clock size={12} className="text-gold" />
                        </div>
                        09:00 AM - 06:00 PM
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                          <MapPin size={12} className="text-gold" />
                        </div>
                        {i === 1 ? 'The Taj Mahal Palace Hotel' : 'Nahargarh Fort & Amer'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-5 bg-white text-charcoal rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-white hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all shadow-2xl active:scale-95">
              Studio Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
