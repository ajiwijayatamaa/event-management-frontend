import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BarChart3, Calendar, Plus, Users } from "lucide-react";
import { Link, redirect } from "react-router";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useAuth } from "~/stores/useAuth";
import { useState } from "react";
import useGetStatistics from "~/hooks/api/useGetStatistics";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ORGANIZER") return redirect("/");
};

// config warna untuk shadcn chart
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
};

const Dashboard = () => {
  const [period, setPeriod] = useState<"year" | "month" | "day">("month");
  const { data, isPending, isError } = useGetStatistics(period);

  return (
    <div className="flex min-h-screen bg-background">
      <OrganizerSidebar />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your events and track transactions.
            </p>
          </div>
          <Button asChild className="bg-blue-600">
            <Link to="/organizer/events/create">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Link>
          </Button>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isPending ? "..." : (data?.summary.activeEvents ?? 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tickets Sold
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isPending ? "..." : (data?.summary.totalTicketsSold ?? 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <span className="text-xs font-bold text-muted-foreground">
                IDR
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isPending
                  ? "..."
                  : `Rp ${(data?.summary.totalRevenue ?? 0).toLocaleString("id-ID")}`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Event Reports
            </CardTitle>
            <Tabs
              value={period}
              onValueChange={(val) =>
                setPeriod(val as "year" | "month" | "day")
              }
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : isError ? (
              <div className="h-64 flex items-center justify-center text-red-500">
                Failed to load chart data.
              </div>
            ) : data?.chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data available.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={data?.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          `Rp ${Number(value).toLocaleString("id-ID")}`
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* SHORTCUT KE HALAMAN LAIN */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage all incoming transactions.
              </p>
              <Button asChild variant="outline">
                <Link to="/organizer/transactions">View Transactions</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your events and view attendee lists.
              </p>
              <Button asChild variant="outline">
                <Link to="/organizer/events">View Events</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
