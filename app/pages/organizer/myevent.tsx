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
  Eye,
  Ticket,
} from "lucide-react";
// Pastikan mockEvents kamu menggunakan naming: availableSeats & totalSeats sesuai Prisma
import { mockEvents } from "~/data/mockdata";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";

const MyEvents = () => {
  const events = mockEvents;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEventStatus = (event: (typeof events)[0]) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start)
      return { label: "Upcoming", color: "bg-blue-100 text-blue-700" };
    if (now >= start && now <= end)
      return { label: "Ongoing", color: "bg-green-100 text-green-700" };
    return { label: "Past", color: "bg-gray-100 text-gray-600" };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <OrganizerSidebar />

      <main className="flex-1">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                <p className="text-muted-foreground">
                  Manage your event listings and monitor ticket sales.
                </p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/organizer/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
            </div>

            {/* Search - Poin: Organizers can manage events */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by event name..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event, index) => {
                const status = getEventStatus(event);
                // Sesuai Skema Prisma: totalSeats & availableSeats
                const soldTickets = event.totalSeats - event.availableSeats;
                const soldPercentage = (soldTickets / event.totalSeats) * 100;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden border-border/50 hover:shadow-md transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={event.image || "/placeholder-event.jpg"}
                          alt={event.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className={`${status.color} border-none`}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 opacity-90"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link to={`/events/${event.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View Landing
                                  Page
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/organizer/events/${event.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Event
                                </Link>
                              </DropdownMenuItem>
                              {/* Poin: Attendee List */}
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/organizer/events/${event.id}/attendees`}
                                >
                                  <Users className="mr-2 h-4 w-4" /> View
                                  Attendee List
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-bold">
                            Rp {Number(event.price).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold line-clamp-1 mb-3">
                          {event.name}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {/* Sales Progress - Menggunakan field Prisma */}
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="flex items-center gap-1 font-medium">
                              <Ticket className="h-3 w-3" /> Sales Progress
                            </span>
                            <span className="text-muted-foreground">
                              {soldTickets} / {event.totalSeats} Sold
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all"
                              style={{ width: `${soldPercentage}%` }}
                            />
                          </div>
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
