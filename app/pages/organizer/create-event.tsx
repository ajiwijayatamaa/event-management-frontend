import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  FileText,
  TicketPercent,
} from "lucide-react";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";

const formSchema = z.object({
  email: z.email({ error: "invalid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const CreateEvent = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <div className="flex min-h-screen bg-background">
      <OrganizerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4 -ml-2">
                <Link to="/organizer/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </Button>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Create New Event
              </h1>
              <p className="text-muted-foreground">
                Fill in the details to publish your event to the platform.
              </p>
            </div>

            <form className="space-y-8 pb-20">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information - Matching Prisma Model 'Event' */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Event Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Event Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter event name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Tell people what this event is about..."
                          rows={8}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="location"
                            name="location"
                            placeholder="Physical venue or link"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date & Time *</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="datetime-local"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date & Time *</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="datetime-local"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* VOUCHER - (Clue: Provided by Organizer) */}
                  <Card className="border-border/50 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TicketPercent className="h-5 w-5 text-primary" />
                        Event Voucher
                      </CardTitle>
                      <CardDescription>
                        Create a special discount specifically for this event.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="voucherCode">Voucher Code</Label>
                          <Input
                            id="voucherCode"
                            placeholder="E.g. DISKONASIK"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discountPercentage">
                            Discount (%)
                          </Label>
                          <Input
                            id="discountPercentage"
                            type="number"
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="voucherQuota">Quota</Label>
                          <Input
                            id="voucherQuota"
                            type="number"
                            placeholder="50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="voucherExpiry">
                            Voucher End Date
                          </Label>
                          <Input id="voucherExpiry" type="datetime-local" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">
                  {/* Pricing & Capacity */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket Setting</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (Rp)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                            Rp
                          </span>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="0"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalSeats">Total Seats *</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="totalSeats"
                            name="totalSeats"
                            type="number"
                            placeholder="100"
                            className="pl-10"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                          Available seats will be set equal to total seats.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Banner Image */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Event Banner</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 transition-colors hover:bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="mt-2 text-xs font-medium text-center">
                          Upload Event Image
                        </p>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <Button variant="ghost" size="lg" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Create Event
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link to="/organizer/events">Cancel</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
