import { Link, useLocation } from "react-router"; // Ganti ke "react-router-dom" jika pakai versi lama
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Menu, X, Ticket } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 1. Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Eventify</span>
          </Link>

          {/* 2. Desktop Navigation */}
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
            </Link>{" "}
          </div>

          {/* 3. Search Bar */}
          <div className="hidden max-w-md flex-1 px-8 lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Find your next event..."
                className="w-full pl-10 bg-secondary/50 border-transparent focus:border-primary/30"
              />
            </div>
          </div>

          {/* 4. Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-medium">
                Log in
              </Button>
            </Link>

            <Link to="/register">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Sign Up
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* 5. Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden border-t"
            >
              <div className="flex flex-col gap-4 pb-6 pt-4">
                <Link
                  to="/"
                  className="text-sm font-medium px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Events
                </Link>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
