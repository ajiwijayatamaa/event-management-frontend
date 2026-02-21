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
  if (user.role !== "ORGANIZER") return redirect("/");
};

// ─── Component ────────────────────────────────────────────────────────────────

const EventAttendees = () => {
  const { slug } = useParams<{ slug: string }>();

  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedValue] = useDebounceValue(search, 500);

  const { data, isPending, isError } = useGetAttendees(slug || "");

  const attendees = data?.data || [];
  const meta = data?.meta;

  const filteredAttendees = attendees.filter(
    (a: any) =>
      a.user?.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(debouncedValue.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <OrganizerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="mb-10">
              <Button
                variant="ghost"
                asChild
                className="mb-6 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
              >
                <Link to="/organizer/events">
                  <ArrowLeft className="mr-2 h-3 w-3" /> Back to Events
                </Link>
              </Button>

              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Manajemen Peserta
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Daftar <span className="text-orange-500">Peserta</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                {meta?.eventName || slug}
              </p>
            </div>

            {/* ── Stat Cards ───────────────────────────────────────────── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-none shadow-sm rounded-[1.5rem] bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100">
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Total Peserta
                      </p>
                      <p className="text-xl font-black italic tracking-tight text-zinc-900">
                        {meta?.totalAttendees ?? 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[1.5rem] bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100">
                      <Ticket className="h-5 w-5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Total Tiket Terjual
                      </p>
                      <p className="text-xl font-black italic tracking-tight text-zinc-900">
                        {meta?.totalTickets ?? 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Search ───────────────────────────────────────────────── */}
            <div className="mb-8 relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
              <Input
                className="pl-11 h-12 rounded-2xl border-zinc-200 bg-white shadow-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium text-sm"
                type="text"
                placeholder="Cari nama atau email peserta..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>

            {/* ── Attendees Table ───────────────────────────────────────── */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                  <Users className="h-5 w-5 text-orange-500" />
                  Daftar Peserta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Loading */}
                {isPending && (
                  <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-black uppercase text-[10px] tracking-widest">
                      Memuat data peserta...
                    </p>
                  </div>
                )}

                {/* Error */}
                {isError && (
                  <div className="py-24 text-center text-sm font-bold text-red-500">
                    Gagal mengambil data peserta.
                  </div>
                )}

                {/* Empty */}
                {!isPending && filteredAttendees.length === 0 && (
                  <div className="py-24 text-center">
                    <Users className="mx-auto h-10 w-10 text-zinc-200 mb-3" />
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
                      Belum ada peserta
                    </p>
                    <p className="text-xs font-medium text-zinc-300 mt-1">
                      Peserta akan muncul setelah tiket dibeli.
                    </p>
                  </div>
                )}

                {/* Table */}
                {!isPending && filteredAttendees.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-100 text-left">
                          <th className="px-8 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Peserta
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Order ID
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Tiket
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Total
                          </th>
                          <th className="px-4 pb-4 pt-6 pr-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Tanggal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {filteredAttendees.map((attendee: any) => (
                          <tr
                            key={attendee.id}
                            className="hover:bg-zinc-50/50 transition-colors"
                          >
                            {/* Peserta */}
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 rounded-xl">
                                  <AvatarImage
                                    src={attendee.user?.profilePicture}
                                  />
                                  <AvatarFallback className="rounded-xl bg-orange-100 text-orange-600 font-black text-sm">
                                    {attendee.user?.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm text-zinc-900">
                                    {attendee.user?.name || "-"}
                                  </p>
                                  <p className="text-[11px] text-zinc-400 font-medium">
                                    {attendee.user?.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Order ID */}
                            <td className="px-4 py-5">
                              <span className="font-mono text-xs font-bold text-zinc-400">
                                #{attendee.id}
                              </span>
                            </td>

                            {/* Tiket */}
                            <td className="px-4 py-5">
                              <span className="font-black italic text-zinc-700">
                                {attendee.ticketQuantity}
                              </span>
                            </td>

                            {/* Total */}
                            <td className="px-4 py-5">
                              <span className="font-black italic text-sm text-zinc-900">
                                {formatPrice(Number(attendee.totalPrice))}
                              </span>
                            </td>

                            {/* Tanggal */}
                            <td className="px-4 py-5 pr-8">
                              <span className="text-[11px] font-medium text-zinc-400">
                                {formatDate(attendee.createdAt)}
                              </span>
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
