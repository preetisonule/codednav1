import {
  User,
  LayoutDashboard,
  LogOut,
  RefreshCw,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import favicon from "/favicon.svg";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.08] bg-black/70 px-6 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="flex items-center gap-10">

          {/* Logo */}
          <Link
            to="/analyze"
            className="group flex items-center gap-3"
          >
            <div className="relative">

              {/* Glow */}
              <div className="absolute inset-0 rounded-xl bg-[#4452fe]/40 blur-lg transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                <img
                  src={favicon}
                  alt="CodeDNA Logo"
                  className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-semibold tracking-tight text-white">
                Code<span className="text-[#6472ff]">DNA</span>
              </span>

              <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/35">
                Prepare for Excellance
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center md:flex">
            <Link
              to="/dashboard"
              className={`group relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-all duration-150 ${
                location.pathname === "/analyze"
                  ? "text-white"
                  : "text-white/45 hover:text-[#6674ff]"
              }`}
            >
              <LayoutDashboard
                size={17}
                strokeWidth={1.8}
                className={`transition-colors ${
                  location.pathname === "/analyze"
                    ? "text-[#6674ff]"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              />

              <span>Dashboard</span>

              {/* Active indicator */}
              {location.pathname === "/analyze" && (
                <span className="absolute -bottom-[13px] left-3 right-3 h-[2px] rounded-full bg-[#5865ff] shadow-[0_0_10px_rgba(88,101,255,0.8)]" />
              )}
            </Link>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="flex items-center gap-3">

          {/* Analyze Again */}
          <Link
            to="/analyze"
            className="group flex items-center gap-2 rounded-xl border border-[#5865ff]/20 bg-[#5865ff]/10 px-3.5 py-2 text-sm font-medium text-[#aeb5ff] transition-all duration-200 hover:border-[#5865ff]/40 hover:bg-[#5865ff]/20 hover:text-white hover:shadow-[0_0_20px_rgba(88,101,255,0.15)]"
          >
            <RefreshCw
              size={15}
              strokeWidth={2}
              className="transition-transform duration-500 group-hover:rotate-180"
            />

            <span className="hidden sm:block">
              Analyze Again
            </span>
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className={`group flex items-center gap-3 rounded-xl border px-2.5 py-1.5 transition-all duration-200 ${
              location.pathname === "/profile"
                ? "border-[#5865ff]/30 bg-[#5865ff]/10 shadow-[0_0_20px_rgba(88,101,255,0.08)]"
                : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] hover:bg-white/[0.08]"
            }`}
          >
            {/* Avatar */}
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                location.pathname === "/profile"
                  ? "bg-[#5865ff] shadow-[0_0_15px_rgba(88,101,255,0.4)]"
                  : "bg-white/[0.08] group-hover:bg-[#5865ff]/80"
              }`}
            >
              <User
                size={15}
                strokeWidth={2}
                className="text-white"
              />

              {/* Online indicator */}
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-black bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium text-white/90">
                Profile
              </p>

              <p className="text-[10px] text-white/35">
                Developer
              </p>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-white/[0.08] sm:block" />

          {/* Logout */}
          <button
            onClick={onLogout}
            className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:block">
              Logout
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}