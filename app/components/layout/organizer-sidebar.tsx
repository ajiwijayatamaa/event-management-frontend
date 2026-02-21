import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  Settings,
  Ticket,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";

import { useState } from "react";
import { cn } from "~/lib/utils";

const OrganizerSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/organizer/dashboard",
    },
    {
      title: "My Events",
      icon: Calendar,
      href: "/organizer/events",
    },
    {
      title: "Create Event",
      icon: PlusCircle,
      href: "/organizer/events/create",
    },
    {
      title: "Transactions",
      icon: Receipt,
      href: "/organizer/transactions",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/organizer/events") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Ticket className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Eventify</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default OrganizerSidebar;
