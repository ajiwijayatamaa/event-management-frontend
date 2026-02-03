import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { motion } from "framer-motion";
import {
  Search,
  Download,
  Receipt,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Link } from "react-router";
import { mockEvents, mockTransactions, mockUsers } from "~/data/mockdata";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";

const Transactions = () => {
  const transactions = mockTransactions;

  const totalRevenue = transactions
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const pendingRevenue = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const confirmedCount = transactions.filter(
    (t) => t.status === "confirmed",
  ).length;
  const pendingCount = transactions.filter(
    (t) => t.status === "pending",
  ).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
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
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold">
                  Transactions
                </h1>
                <p className="text-muted-foreground">
                  View and manage all your event transactions
                </p>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                      <DollarSign className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="font-display text-2xl font-bold">
                        ${totalRevenue.toLocaleString()}
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
                      <p className="text-sm text-muted-foreground">
                        Pending Revenue
                      </p>
                      <p className="font-display text-2xl font-bold">
                        ${pendingRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="font-display text-2xl font-bold">
                        {confirmedCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="font-display text-2xl font-bold">
                        {pendingCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {mockEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  All Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Transaction ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Event</th>
                        <th className="pb-3 font-medium">Tickets</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.map((transaction) => {
                        const event = mockEvents.find(
                          (e) => e.id === transaction.eventId,
                        );
                        const user = mockUsers.find(
                          (u) => u.id === transaction.userId,
                        );
                        return (
                          <tr key={transaction.id} className="text-sm">
                            <td className="py-4 font-mono">
                              #{transaction.id}
                            </td>
                            <td className="py-4">
                              <div>
                                <p className="font-medium">
                                  {user?.name || "Unknown"}
                                </p>
                                <p className="text-muted-foreground">
                                  {user?.email}
                                </p>
                              </div>
                            </td>
                            <td className="py-4">
                              <Link
                                to={`/events/${event?.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {event?.name || "Unknown"}
                              </Link>
                            </td>
                            <td className="py-4">
                              {transaction.ticketQuantity}
                            </td>
                            <td className="py-4 font-semibold">
                              ${transaction.totalPrice}
                            </td>
                            <td className="py-4">
                              <Badge
                                className={`flex w-fit items-center gap-1 ${
                                  transaction.status === "confirmed"
                                    ? "bg-success/10 text-success"
                                    : transaction.status === "pending"
                                      ? "bg-warning/10 text-warning"
                                      : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {getStatusIcon(transaction.status)}
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {transaction.status === "pending" && (
                                  <Button variant="ghost" size="sm">
                                    Confirm
                                  </Button>
                                )}
                              </div>
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

export default Transactions;
