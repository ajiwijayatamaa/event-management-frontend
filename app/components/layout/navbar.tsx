import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Search,
  Menu,
  X,
  Ticket,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "~/stores/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Eventify
            </span>
          </Link>

          {/* Navigasi Tengah (Desktop) */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse Events
            </Link>
          </div>

          {/* Bagian Kanan: Search & Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Hanya tampil di Desktop & Bukan halaman Organizer) */}
            {!location.pathname.startsWith("/organizer") && (
              <div className="hidden max-w-xs relative lg:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari event..."
                  className="w-full pl-10 bg-secondary/50 border-none h-9 text-sm"
                />
              </div>
            )}

            {user ? (
              <div className="relative">
                {/* Hamburger / Profile Trigger */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-1 pl-2 hover:bg-secondary rounded-full border border-transparent hover:border-border"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="hidden md:inline text-sm font-medium text-muted-foreground">
                    {user.name.split(" ")[0]} {/* Ambil nama depan saja */}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden shadow-inner border border-white">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        key={user.profilePicture} // Paksa rerender jika URL berubah
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-border bg-card p-2 shadow-xl"
                      >
                        <div className="px-3 py-2 border-b mb-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Menu
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary transition-colors"
                        >
                          <User className="h-4 w-4 text-blue-500" /> Profil Saya
                        </Link>

                        {user.role === "ORGANIZER" && (
                          <Link
                            to="/organizer/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-orange-500" />{" "}
                            Dashboard
                          </Link>
                        )}

                        <div className="my-1 border-t border-border" />

                        <button
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  >
                    Daftar
                  </Button>
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
