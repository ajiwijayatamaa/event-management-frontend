import { Link, useParams } from "react-router";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Calendar,
  Info,
  MapPin,
  Minus,
  Plus,
  Ticket,
  Users,
} from "lucide-react";
import { useState } from "react";
import { getEventById, mockReviews } from "~/data/mockData";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id || "");
  const [ticketCount, setTicketCount] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  // Format Mata Uang IDR (Sesuai tipe Decimal di Prisma)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const totalPrice = Number(event.price) * ticketCount;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar userRole="customer" isLoggedIn={true} />

      <main className="flex-1 pb-12">
        {/* Banner Image */}
        <div className="relative h-[45vh] w-full overflow-hidden">
          <img
            src={event.image || "/placeholder.jpg"}
            alt={event.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sisi Kiri: Info Event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card className="border-none shadow-2xl">
                <CardContent className="p-8">
                  <h1 className="text-4xl font-bold tracking-tight mb-6">
                    {event.name}
                  </h1>

                  <div className="grid gap-4 sm:grid-cols-2 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                      <Calendar className="text-blue-600 h-6 w-6" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">
                          Date
                        </p>
                        <p className="font-medium text-sm">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                      <MapPin className="text-blue-600 h-6 w-6" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">
                          Location
                        </p>
                        <p className="font-medium text-sm">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" /> Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews - Bisa disambungkan ke tabel Review jika ada */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>What people say</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 border-b last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm">
                          Reviewer {review.id}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sisi Kanan: Booking Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="sticky top-24 border-blue-100 shadow-2xl">
                <CardHeader className="bg-blue-50/50 rounded-t-xl">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Price per ticket
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      {Number(event.price) === 0
                        ? "FREE"
                        : formatPrice(Number(event.price))}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Kuota - Menggunakan field Prisma availableSeats */}
                  <div className="flex justify-between items-center text-sm bg-blue-50 p-3 rounded-lg text-blue-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <Users size={16} /> Available Spots
                    </div>
                    <span className="font-bold">
                      {event.availableSeats} / {event.totalSeats}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-bold">Quantity</Label>
                    <div className="flex items-center justify-between border p-2 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setTicketCount(Math.max(1, ticketCount - 1))
                        }
                        disabled={ticketCount <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="font-bold text-lg">{ticketCount}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setTicketCount(
                            Math.min(event.availableSeats, ticketCount + 1),
                          )
                        }
                        disabled={ticketCount >= event.availableSeats}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-bold">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-blue-700">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-200">
                    <Ticket className="mr-2" /> Book Ticket Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
