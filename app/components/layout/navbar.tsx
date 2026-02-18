import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Ticket,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/stores/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-[#1a1a1a] bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#1a1a1a] bg-[#ff6b35] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter text-[#1a1a1a]">
              Eventify
            </span>
          </Link>

          {/* Navigasi Tengah */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className={`text-xs font-bold uppercase tracking-widest transition-all ${
                isActive("/")
                  ? "border-b-4 border-[#ff6b35] text-[#1a1a1a]"
                  : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
              }`}
            >
              Browse Events
            </Link>
          </div>

          {/* Bagian Kanan */}
          <div className="flex items-center gap-4">
            {!location.pathname.startsWith("/organizer") && (
              <div className="hidden max-w-[200px] relative lg:block">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1a1a1a]" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-9 bg-[#f5f5f5] border-2 border-[#1a1a1a] rounded-none h-8 text-[10px] font-bold focus:ring-0 focus:offset-0"
                />
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 border-2 border-[#1a1a1a] bg-white p-1 pr-2 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <div className="h-7 w-7 border border-[#1a1a1a] bg-[#ffeb3b] overflow-hidden">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="h-full w-full object-cover"
                        alt="pfp"
                      />
                    ) : (
                      <User className="h-4 w-4 m-auto mt-1" />
                    )}
                  </div>
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-tight">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-56 border-4 border-[#1a1a1a] bg-white shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] z-50 overflow-hidden font-mono"
                      >
                        {/* --- LOGIKA DINAMIS DISINI --- */}
                        {user.role === "ORGANIZER" && (
                          <Link
                            to="/organizer/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase border-b-2 border-[#1a1a1a] bg-[#ffffff] text-black hover:bg-[#e85a2a] transition-colors"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5" />{" "}
                            Organizer Dashboard
                          </Link>
                        )}
                        {/* ----------------------------- */}

                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase border-b-2 border-[#1a1a1a] hover:bg-[#ffeb3b] transition-colors"
                        >
                          <User className="h-3.5 w-3.5" /> Profile
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase text-red-500 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-[10px] font-black uppercase hover:underline"
                >
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-[#1a1a1a] text-white px-4 py-1.5 text-[10px] font-black uppercase border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(255,107,53,1)]">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
