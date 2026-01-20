import { Phone, Mail, Calendar } from "lucide-react";

export default function FollowUpList({ followUps = [] }) {
  const defaultFollowUps = [
    { id: 1, type: "phone", name: "Ananya Sharma", date: "15 Jan", time: "10:30 AM" },
    { id: 2, type: "mail", name: "Megha Rao", date: "16 Jan", time: "02:00 PM" },
  ];

  const displayFollowUps = followUps.length > 0 ? followUps : defaultFollowUps;

  return (
    <div className="bg-white rounded-2xl border border-[#e6e3df]/40 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-lg">Follow-Ups</h3>
        <button className="text-[10px] uppercase tracking-widest font-semibold text-mutedbrown hover:text-charcoal transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-5">
        {displayFollowUps.map((item) => (
          <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-ivory last:border-0 last:pb-0">
            <div className="w-10 h-10 bg-ivory rounded-full flex items-center justify-center text-mutedbrown">
              {item.type === "phone" ? <Phone size={16} /> : <Mail size={16} />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[10px] text-warmgray uppercase tracking-tighter font-semibold">
                  <Calendar size={10} /> {item.date}
                </span>
                <span className="w-1 h-1 bg-warmgray/40 rounded-full"></span>
                <span className="text-[10px] text-warmgray font-medium uppercase tracking-tighter">
                  {item.time}
                </span>
              </div>
            </div>
            <button className="text-[10px] font-bold uppercase text-charcoal bg-beige px-3 py-1.5 rounded-sm hover:bg-mutedbrown hover:text-white transition-all">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
