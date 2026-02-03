import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { motion } from "framer-motion";
import {
  Users,
  Ticket,
  DollarSign,
  Calendar,
  Download,
  Mail,
} from "lucide-react";

import { useLoaderData, Link } from "react-router";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";

type Attendee = {
  id: number;
  ticketQuantity: number;
  totalPrice: number;
  pointsUsed: number;
  confirmedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    profilePicture?: string;
  };
  voucher?: {
    code: string;
  };
  coupon?: {
    code: string;
  };
};

type EventData = {
  event: {
    id: number;
    name: string;
    location?: string;
    startDate: string;
    endDate: string;
    totalSeats: number;
    availableSeats: number;
  };
  attendees: Attendee[];
};

const EventAttendees = () => {
  const { event, attendees } = useLoaderData<EventData>();

  // Stats
  const totalTicketsSold = attendees.reduce(
    (sum, a) => sum + a.ticketQuantity,
    0,
  );
  const totalRevenue = attendees.reduce(
    (sum, a) => sum + Number(a.totalPrice),
    0,
  );
  const totalAttendees = attendees.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl font-bold">
                    {event.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Attendee List & Statistics
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/events/${event.id}`}>View Event</Link>
                  </Button>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.startDate)}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    📍 {event.location}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Attendees
                      </p>
                      <p className="text-2xl font-bold">{totalAttendees}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                      <Ticket className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tickets Sold
                      </p>
                      <p className="text-2xl font-bold">{totalTicketsSold}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        Rp {totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                      <Ticket className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Available Seats
                      </p>
                      <p className="text-2xl font-bold">
                        {event.availableSeats} / {event.totalSeats}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendees Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Confirmed Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Attendee</th>
                        <th className="pb-3 font-medium">Tickets</th>
                        <th className="pb-3 font-medium">Total Paid</th>
                        <th className="pb-3 font-medium">Discount Used</th>
                        <th className="pb-3 font-medium">Confirmed At</th>
                        <th className="pb-3 font-medium text-right">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {attendees.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-muted-foreground"
                          >
                            No confirmed attendees yet
                          </td>
                        </tr>
                      ) : (
                        attendees.map((attendee) => (
                          <tr key={attendee.id} className="text-sm">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={attendee.user.profilePicture}
                                    alt={attendee.user.name}
                                  />
                                  <AvatarFallback>
                                    {getInitials(attendee.user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {attendee.user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {attendee.user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <Badge variant="outline">
                                {attendee.ticketQuantity}x
                              </Badge>
                            </td>
                            <td className="py-4 font-bold">
                              Rp {Number(attendee.totalPrice).toLocaleString()}
                            </td>
                            <td className="py-4">
                              <div className="flex flex-col gap-1">
                                {attendee.pointsUsed > 0 && (
                                  <Badge className="bg-green-100 text-green-700 w-fit">
                                    -{attendee.pointsUsed} pts
                                  </Badge>
                                )}
                                {attendee.voucher && (
                                  <Badge className="bg-blue-100 text-blue-700 w-fit">
                                    {attendee.voucher.code}
                                  </Badge>
                                )}
                                {attendee.coupon && (
                                  <Badge className="bg-purple-100 text-purple-700 w-fit">
                                    {attendee.coupon.code}
                                  </Badge>
                                )}
                                {!attendee.pointsUsed &&
                                  !attendee.voucher &&
                                  !attendee.coupon && (
                                    <span className="text-muted-foreground">
                                      -
                                    </span>
                                  )}
                              </div>
                            </td>
                            <td className="py-4 text-xs text-muted-foreground">
                              {formatDate(attendee.confirmedAt)}
                            </td>
                            <td className="py-4 text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`mailto:${attendee.user.email}`}>
                                  <Mail className="h-4 w-4" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EventAttendees;
