import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image,
  IndianRupee,
  Calendar,
  X,
  LogOut
} from "lucide-react";
import toast from "react-hot-toast";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "CRM", path: "/crm", icon: Users },
  { name: "Smart Gallery", path: "/gallery", icon: Image },
  { name: "Finance", path: "/finance", icon: IndianRupee },
  { name: "Calendar", path: "/calendar", icon: Calendar },
];

export default function Sidebar({ onClose }) {
  return (
    <div className="w-64 h-full bg-white border-r border-[#e6e3df] px-6 py-10 flex flex-col shadow-xl lg:shadow-none">
      <div className="flex justify-between items-center mb-12 px-2">
        <div className="flex flex-col gap-4">
          {/* Logo added here */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-2xl flex items-center justify-center shadow-md">
            <img src="/team-alpha-logo.png" alt="Team Alpha Logo" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-tighter text-charcoal">Team Alpha Photography</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-mutedbrown font-bold mt-1">The Wedding Artist</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-ivory rounded-full">
            <X size={20} className="text-warmgray" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                ? "bg-charcoal text-white shadow-lg shadow-charcoal/20"
                : "text-warmgray hover:bg-ivory/50 hover:text-charcoal"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 mb-4">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              window.location.href = "/";
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 text-warmgray hover:bg-ivory/50 hover:text-charcoal group"
        >
          <LogOut size={20} strokeWidth={1.5} className="group-hover:text-charcoal transition-colors" />
          Log Out
        </button>
      </div>

      <div className="pt-6 border-t border-[#f0f0f0]">
        <div
          onClick={() => toast("Alpha Core v2.4.0\nCompiling Assets... Optimized.", { icon: '🚀', duration: 3000 })}
          className="mt-8 px-4 py-6 bg-ivory/40 rounded-3xl border border-ivory cursor-pointer hover:bg-white hover:shadow-md transition-all group"
        >
          <p className="text-[9px] uppercase tracking-widest text-warmgray font-bold text-center group-hover:text-charcoal transition-colors">
            Project: <span className="text-charcoal">Alpha Core v2</span>
          </p>
        </div>
      </div>
    </div>
  );
}
