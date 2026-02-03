import {
  Calendar,
  Coins,
  Info,
  MapPin,
  Minus,
  Plus,
  Ticket,
  TicketPercent,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { getEventById, mockReviews } from "~/data/mockdata";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id || "");

  // State untuk Fitur 2
  const [ticketCount, setTicketCount] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);

  // Mock data User (Nanti ambil dari context/session)
  const userPointsBalance = 10000; // Sesuai default di Prisma: 10.000

  if (!event)
    return <div className="p-20 text-center font-bold">Event not found</div>;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Kalkulasi Total (Logika Fitur 2)
  const subtotal = Number(event.price) * ticketCount;
  const pointsToUse = usePoints ? Math.min(userPointsBalance, subtotal) : 0;
  const totalPay = subtotal - pointsToUse;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userRole="customer" isLoggedIn={true} />

      <main className="flex-1 pb-12">
        {/* Banner */}
        <div className="relative h-[40vh] w-full overflow-hidden">
          <img
            src={event.image || "/placeholder.jpg"}
            className="h-full w-full object-cover"
            alt={event.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* KIRI: Informasi Event */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-xl">
                <CardContent className="p-8">
                  <h1 className="text-4xl font-bold mb-6">{event.name}</h1>
                  <div className="grid gap-4 sm:grid-cols-2 mb-8">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                      <Calendar className="text-primary h-5 w-5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">
                          Date
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(event.startDate).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                      <MapPin className="text-primary h-5 w-5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">
                          Location
                        </p>
                        <p className="text-sm font-medium">{event.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Info className="h-5 w-5" /> Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 border-b last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-bold">
                          User {review.id}
                        </span>
                      </div>
                      <p className="text-sm italic text-muted-foreground">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* KANAN: Booking Panel (FITUR 2 LOGIC) */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-primary/10 shadow-2xl overflow-hidden">
                <div className="bg-primary p-4 text-primary-foreground">
                  <p className="text-xs opacity-80 uppercase font-bold">
                    Price per ticket
                  </p>
                  <p className="text-2xl font-black">
                    {Number(event.price) === 0
                      ? "FREE"
                      : formatPrice(Number(event.price))}
                  </p>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Kuota (Schema: available_seats) */}
                  <div className="flex justify-between items-center text-sm bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2 font-semibold">
                      <Users size={16} /> Available Spots
                    </div>
                    <span className="font-bold">
                      {event.availableSeats} / {event.totalSeats}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <Label className="font-bold">Quantity</Label>
                    <div className="flex items-center justify-between border p-2 rounded-xl">
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

                  <Separator />

                  {/* FITUR 2: Promo & Points */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <TicketPercent className="h-4 w-4 text-primary" /> Promo
                        Code
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Event Voucher / Coupon"
                          className="text-xs font-mono uppercase"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Points Toggle (Requirement 2b) */}
                    <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-950/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                      <Checkbox
                        id="points"
                        checked={usePoints}
                        onCheckedChange={(checked) => setUsePoints(!!checked)}
                      />
                      <div className="grid gap-1">
                        <label
                          htmlFor="points"
                          className="text-xs font-bold flex items-center gap-1 cursor-pointer text-green-700 dark:text-green-400"
                        >
                          <Coins className="h-3 w-3" /> Use My Points
                        </label>
                        <p className="text-[10px] text-muted-foreground">
                          Available: {formatPrice(userPointsBalance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    {usePoints && (
                      <div className="flex justify-between text-xs text-green-600 font-bold">
                        <span>Points Used</span>
                        <span>-{formatPrice(pointsToUse)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-black text-primary pt-2 border-t border-dashed">
                      <span>Total Pay</span>
                      <span>{formatPrice(totalPay)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-lg font-bold shadow-lg"
                    disabled={event.availableSeats === 0}
                  >
                    <Ticket className="mr-2 h-5 w-5" />{" "}
                    {event.availableSeats === 0
                      ? "Sold Out"
                      : "Book Ticket Now"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
