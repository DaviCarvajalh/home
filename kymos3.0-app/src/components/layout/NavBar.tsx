"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Layers } from "lucide-react";

interface NavBarProps {
  userName: string;
  userRole: string;
}

export default function NavBar({ userName, userRole }: NavBarProps) {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-CL", {
          hour:   "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("es-CL", {
          weekday: "long",
          day:     "numeric",
          month:   "long",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f1535] border-b border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
          <Layers size={18} className="text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">KyMOS</p>
          <p className="text-white/40 text-[10px] mt-0.5">Enterprise Resource Planning</p>
        </div>
      </div>

      {/* Right: user + clock + logout */}
      <div className="flex items-center gap-5">
        {/* User */}
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-semibold leading-none">{userName}</p>
          <p className="text-white/40 text-[11px] mt-0.5">{userRole.toLowerCase()}</p>
        </div>

        {/* Clock */}
        <div className="text-right hidden md:block">
          <p className="text-white text-sm font-mono leading-none">{time}</p>
          <p className="text-white/40 text-[11px] mt-0.5 capitalize">{date}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/70 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg text-sm transition-all"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
