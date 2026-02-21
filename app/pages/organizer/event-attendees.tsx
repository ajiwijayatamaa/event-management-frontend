import { motion } from "framer-motion";
import { ArrowLeft, Search, Ticket, Users } from "lucide-react";
import { redirect, Link, useParams } from "react-router";
import { useQueryState } from "nuqs";
import { useDebounceValue } from "usehooks-ts";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import useGetAttendees from "~/hooks/api/useGetAttendees";
import { useAuth } from "~/stores/useAuth";
import { formatDate, formatPrice } from "~/utils/formatter";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

const EventAttendees = () => {
  const { slug } = useParams<{ slug: string }>();

  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedValue] = useDebounceValue(search, 500);

  const { data, isPending, isError } = useGetAttendees(slug || "");

  const attendees = data?.data || [];
  const meta = data?.meta;

  // Filter attendees berdasarkan search (client-side)
  const filteredAttendees = attendees.filter(
    (a: any) =>
      a.user?.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(debouncedValue.toLowerCase()),
  );

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
                  Kembali ke Events
                </Link>
              </Button>
              <div>
                <h1 className="font-display text-3xl font-bold">
                  Daftar Peserta
                </h1>
                <p className="text-muted-foreground">
                  {meta?.eventName || slug}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Peserta
                      </p>
                      <p className="text-2xl font-bold">
                        {meta?.totalAttendees ?? 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <Ticket className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Tiket Terjual
                      </p>
                      <p className="text-2xl font-bold">
                        {meta?.totalTickets ?? 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
              <Input
                className="pl-10 border-border/60 focus-visible:ring-blue-600"
                type="text"
                placeholder="Cari peserta..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>

            {/* Tabel Peserta */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Daftar Peserta
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {isPending && (
                  <div className="py-20 text-center text-muted-foreground animate-pulse">
                    Memuat data peserta...
                  </div>
                )}

                {/* Error State */}
                {isError && (
                  <div className="py-20 text-center text-destructive">
                    Gagal mengambil data peserta.
                  </div>
                )}

                {/* Empty State */}
                {!isPending && filteredAttendees.length === 0 && (
                  <div className="py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 font-semibold">Belum ada peserta</h3>
                    <p className="mt-2 text-muted-foreground">
                      Peserta akan muncul di sini setelah tiket dibeli.
                    </p>
                  </div>
                )}

                {/* Tabel */}
                {!isPending && filteredAttendees.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">Peserta</th>
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Tiket</th>
                          <th className="pb-3 font-medium">Total</th>
                          <th className="pb-3 font-medium">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredAttendees.map((attendee: any) => (
                          <tr key={attendee.id} className="text-sm">
                            {/* Peserta */}
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={attendee.user?.profilePicture}
                                  />
                                  <AvatarFallback>
                                    {attendee.user?.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {attendee.user?.name || "-"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {attendee.user?.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Order ID */}
                            <td className="py-4 font-mono">#{attendee.id}</td>

                            {/* Tiket */}
                            <td className="py-4">{attendee.ticketQuantity}</td>

                            {/* Total */}
                            <td className="py-4 font-semibold">
                              {formatPrice(Number(attendee.totalPrice))}
                            </td>

                            {/* Tanggal */}
                            <td className="py-4 text-xs text-muted-foreground">
                              {formatDate(attendee.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
