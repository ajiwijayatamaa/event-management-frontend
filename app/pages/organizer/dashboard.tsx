import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Eye,
  MapPin,
  Plus,
  Users,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <OrganizerSidebar />

      <main className="flex-1 p-8">
        {/* HEADER: Poin "Organizers can view and manage their events" */}
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

        {/* BASIC STATISTICS: Poin "Basic Statistics" */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
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
              <div className="text-2xl font-bold">1,240</div>
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
              <div className="text-2xl font-bold">Rp 45.200.000</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* GRAPHICAL VISUALIZATION: Poin "Display event data in graphical visualizations and reports by year, month, and day" */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Event Reports
              </CardTitle>
              {/* Tab ini mewakili Filter Year/Month/Day */}
              <Tabs defaultValue="month" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="year">Year</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2 px-2 border-b">
                {[30, 45, 60, 80, 50, 90, 100, 70, 40, 55, 65, 85].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500/30 hover:bg-blue-600 rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* EVENT LIST: Detail availableSeats & totalSeats dari Prisma */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold">Gaming Night</h4>
                    <span className="text-xs text-blue-600 font-semibold">
                      Rp 150.000
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin size={12} /> Jakarta, Indonesia
                  </div>
                  <div className="mt-1 w-full bg-secondary h-2 rounded-full">
                    {/* Logic: Total - Available */}
                    <div className="bg-blue-600 h-full rounded-full w-[70%]" />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right">
                    70 / 100 Seats Sold
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* TRANSACTION MANAGEMENT: Poin "Accept, reject, and view user payment proofs" */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Management</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Event</th>
                  <th className="pb-3 font-medium text-center">
                    Payment Proof
                  </th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 font-medium">John Doe</td>
                  <td className="py-4">Gaming Night</td>
                  <td className="py-4 text-center">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <Eye size={16} className="mr-1" /> View Proof
                    </Button>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        className="bg-green-600 h-8 w-8 text-white"
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ATTENDEE LIST: Poin "Show the list of attendees for each event, including name, ticket quantity, and total price paid" */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Attendee List</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium text-center">Ticket Qty</th>
                  <th className="pb-3 font-medium text-right">Total Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4">John Doe</td>
                  <td className="py-4 text-center">2</td>
                  <td className="py-4 text-right font-bold">Rp 300.000</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
