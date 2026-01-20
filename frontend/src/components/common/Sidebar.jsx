import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image,
  IndianRupee,
  Calendar,
  X
} from "lucide-react";

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
        <div>
          <h1 className="font-serif text-3xl tracking-tighter text-charcoal">Team Alpha</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-mutedbrown font-bold mt-1">Registry Studio</p>
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

      <div className="pt-10 border-t border-[#f0f0f0]">
        <div className="mt-8 px-4 py-6 bg-ivory/40 rounded-3xl border border-ivory">
          <p className="text-[9px] uppercase tracking-widest text-warmgray font-bold text-center">
            Project: <span className="text-charcoal">Alpha Core v2</span>
          </p>
        </div>
      </div>
    </div>
  );
}
