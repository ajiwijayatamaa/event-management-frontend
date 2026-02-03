import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Users,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  Eye,
} from "lucide-react";
import { mockEvents } from "~/data/mockdata";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";

const MyEvents = () => {
  const events = mockEvents;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventStatus = (event: (typeof events)[0]) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start)
      return { label: "Upcoming", color: "bg-primary/10 text-primary" };
    if (now >= start && now <= end)
      return { label: "Ongoing", color: "bg-success/10 text-success" };
    return { label: "Past", color: "bg-muted text-muted-foreground" };
  };

  return (
    <div className="flex min-h-screen">
      <OrganizerSidebar />

      <main className="flex-1 bg-background">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold">My Events</h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your events
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/organizer/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search events..." className="pl-10" />
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event, index) => {
                const status = getEventStatus(event);
                const soldTickets = event.totalSeats - event.availableSeats;
                const soldPercentage = (soldTickets / event.totalSeats) * 100;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden border-border/50 hover:shadow-lg transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                          <Badge className={status.color}>{status.label}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/events/${event.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Event
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/organizer/events/${event.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Event
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/organizer/events/${event.id}/attendees`}
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  View Attendees
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/organizer/events/${event.id}/vouchers/create`}
                                >
                                  <Tag className="mr-2 h-4 w-4" />
                                  Create Voucher
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="font-display text-lg font-bold text-primary-foreground">
                            ${event.price}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-display text-lg font-semibold line-clamp-1">
                          {event.name}
                        </h3>
                        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {/* Sales Progress */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Tickets Sold
                            </span>
                            <span className="font-medium">
                              {soldTickets} / {event.totalSeats}
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-gradient-primary transition-all"
                              style={{ width: `${soldPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link to={`/organizer/events/${event.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link
                              to={`/organizer/events/${event.id}/attendees`}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Attendees
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MyEvents;
