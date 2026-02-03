import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import { mockEvents, mockTransactions } from "~/data/mockdata";

const Dashboard = () => {
  const events = mockEvents;
  const transactions = mockTransactions;

  const totalRevenue = transactions
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const totalAttendees = transactions
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + t.ticketQuantity, 0);

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "primary",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "success",
    },
    {
      title: "Total Attendees",
      value: totalAttendees.toLocaleString(),
      change: "+24%",
      trend: "up",
      icon: Users,
      color: "accent",
    },
    {
      title: "Avg. Ticket Sales",
      value: "78%",
      change: "-3%",
      trend: "down",
      icon: TrendingUp,
      color: "warning",
    },
  ];

  const recentEvents = events.slice(0, 4);

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
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's an overview of your events.
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/organizer/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            stat.color === "primary"
                              ? "bg-primary/10"
                              : stat.color === "success"
                                ? "bg-success/10"
                                : stat.color === "accent"
                                  ? "bg-accent/10"
                                  : "bg-warning/10"
                          }`}
                        >
                          <stat.icon
                            className={`h-6 w-6 ${
                              stat.color === "primary"
                                ? "text-primary"
                                : stat.color === "success"
                                  ? "text-success"
                                  : stat.color === "accent"
                                    ? "text-accent"
                                    : "text-warning"
                            }`}
                          />
                        </div>
                        <span
                          className={`flex items-center text-sm font-medium ${
                            stat.trend === "up"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {stat.change}
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="ml-1 h-4 w-4" />
                          )}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="font-display text-2xl font-bold">
                          {stat.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts & Recent Events */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Chart Placeholder */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center rounded-lg bg-secondary/30">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        Revenue chart coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Events</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/organizer/events">View all</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary/50"
                      >
                        <img
                          src={event.image}
                          alt={event.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{event.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.totalSeats - event.availableSeats} /{" "}
                            {event.totalSeats} sold
                          </p>
                        </div>
                        <span className="font-medium text-primary">
                          ${event.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="mt-6 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/organizer/transactions">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Transaction ID</th>
                        <th className="pb-3 font-medium">Event</th>
                        <th className="pb-3 font-medium">Tickets</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.slice(0, 5).map((transaction) => {
                        const event = mockEvents.find(
                          (e) => e.id === transaction.eventId,
                        );
                        return (
                          <tr key={transaction.id} className="text-sm">
                            <td className="py-3 font-mono">
                              #{transaction.id}
                            </td>
                            <td className="py-3">{event?.name || "Unknown"}</td>
                            <td className="py-3">
                              {transaction.ticketQuantity}
                            </td>
                            <td className="py-3 font-medium">
                              ${transaction.totalPrice}
                            </td>
                            <td className="py-3">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  transaction.status === "confirmed"
                                    ? "bg-success/10 text-success"
                                    : transaction.status === "pending"
                                      ? "bg-warning/10 text-warning"
                                      : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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

export default Dashboard;
