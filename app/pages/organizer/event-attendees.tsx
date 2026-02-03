import { useParams, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Download,
  Users,
  Mail,
  Ticket,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  getEventById,
  getTransactionsByEventId,
  mockUsers,
} from "~/data/mockdata";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";

const EventAttendees = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id || "");
  const transactions = getTransactionsByEventId(id || "");

  if (!event) {
    return (
      <div className="flex min-h-screen">
        <OrganizerSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Event not found</h1>
            <Button asChild className="mt-4">
              <Link to="/organizer/events">Back to Events</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const confirmedAttendees = transactions.filter(
    (t) => t.status === "confirmed",
  );
  const pendingAttendees = transactions.filter((t) => t.status === "pending");
  const totalTicketsSold = confirmedAttendees.reduce(
    (sum, t) => sum + t.ticketQuantity,
    0,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
              <Button variant="ghost" asChild className="mb-4">
                <Link to="/organizer/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </Button>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold">
                    Event Attendees
                  </h1>
                  <p className="text-muted-foreground">{event.name}</p>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="font-display text-2xl font-bold">
                        {confirmedAttendees.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="font-display text-2xl font-bold">
                        {pendingAttendees.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Ticket className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tickets Sold
                      </p>
                      <p className="font-display text-2xl font-bold">
                        {totalTicketsSold}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search attendees..." className="pl-10" />
              </div>
            </div>

            {/* Attendees List */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Attendees List
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">Attendee</th>
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Tickets</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {transactions.map((transaction) => {
                          const user = mockUsers.find(
                            (u) => u.id === transaction.userId,
                          );
                          return (
                            <tr key={transaction.id} className="text-sm">
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback>
                                      {user?.name.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {user?.name || "Unknown"}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {user?.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 font-mono">
                                #{transaction.id}
                              </td>
                              <td className="py-4">
                                {transaction.ticketQuantity}
                              </td>
                              <td className="py-4 font-medium">
                                ${transaction.totalPrice}
                              </td>
                              <td className="py-4">
                                <Badge
                                  className={
                                    transaction.status === "confirmed"
                                      ? "bg-success/10 text-success"
                                      : transaction.status === "pending"
                                        ? "bg-warning/10 text-warning"
                                        : "bg-destructive/10 text-destructive"
                                  }
                                >
                                  {transaction.status.charAt(0).toUpperCase() +
                                    transaction.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="py-4 text-muted-foreground">
                                {formatDate(transaction.createdAt)}
                              </td>
                              <td className="py-4">
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 font-semibold">No attendees yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Attendees will appear here once tickets are purchased.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EventAttendees;
