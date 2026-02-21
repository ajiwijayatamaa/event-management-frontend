import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Link, redirect, useNavigate } from "react-router";
import { useDebounceValue } from "usehooks-ts";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import PaginationSection from "~/components/pagination-section";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import useGetOrganizerEvents from "~/hooks/api/useGetOrganizerEvents";
import { useAuth } from "~/stores/useAuth";
import { formatDate, formatDateShort } from "~/utils/formatter";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ORGANIZER") return redirect("/");
};

const MyEvents = () => {
  const navigate = useNavigate();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedValue] = useDebounceValue(search, 500);

  const {
    data: events,
    isPending,
    isError,
  } = useGetOrganizerEvents({
    page,
    take: 3,
    search: debouncedValue,
  });

  const handleCardClick = (slug: string) => {
    navigate(`/events/${slug}`);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <OrganizerSidebar />

      <main className="flex-1 p-6 lg:p-10">
        {/* HEADER SECTION */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Manajemen Event
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
              Acara <span className="text-orange-500">Saya</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">
              Pantau performa, edit detail, dan kelola partisipan event Anda.
            </p>
          </div>

          <Button
            asChild
            className="bg-zinc-900 hover:bg-black text-white rounded-xl h-12 px-6 shadow-xl shadow-zinc-200 transition-all active:scale-95 font-bold uppercase text-xs tracking-widest"
          >
            <Link to="/organizer/events/create">
              <Plus className="mr-2 h-4 w-4 text-orange-400" /> Buat Acara Baru
            </Link>
          </Button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            className="pl-11 h-12 bg-white border-zinc-200 rounded-2xl shadow-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all font-medium text-sm"
            type="text"
            placeholder="Cari judul event atau lokasi..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        {/* EVENT LIST */}
        <div className="space-y-6">
          {isPending && (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-black uppercase text-[10px] tracking-widest">
                Menyusun Daftar Tiket...
              </p>
            </div>
          )}

          {isError && (
            <div className="text-center py-20 bg-red-50 rounded-[2rem] border border-red-100">
              <p className="text-red-500 font-bold uppercase text-xs tracking-widest">
                Gagal memuat data acara.
              </p>
            </div>
          )}

          {events?.data.map((event) => (
            <Card
              key={event.id}
              onClick={() => handleCardClick(event.slug)}
              className="group overflow-hidden border-none shadow-sm hover:shadow-xl hover:shadow-zinc-200 transition-all duration-300 rounded-[2rem] bg-white cursor-pointer relative"
            >
              {/* Ticket Edge Decorator */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2 hidden md:block" />
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2 hidden md:block" />

              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail Image */}
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-zinc-100">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white border-none font-black text-[9px] uppercase italic tracking-widest">
                      {event.slug}
                    </Badge>
                  </div>

                  {/* Main Info Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between border-r border-dashed border-zinc-100">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-orange-600 transition-colors uppercase italic mb-4">
                        {event.name}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <MapPin size={14} className="text-orange-500" />
                          <span className="text-xs font-bold uppercase tracking-tight">
                            {event.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Calendar size={14} className="text-orange-500" />
                          <span className="text-xs font-bold uppercase tracking-tight">
                            {formatDate(event.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Clock size={14} />
                          <span className="text-[10px] font-medium italic">
                            Dibuat: {formatDateShort(event.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-900">
                          <Ticket size={14} className="text-orange-500" />
                          <span className="text-sm font-black italic">
                            Rp {Number(event.price).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="flex flex-wrap gap-2 mt-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all"
                      >
                        <Link
                          to={`/organizer/events/edit/${event.slug}`}
                          className="gap-2"
                        >
                          <Settings size={12} /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all"
                      >
                        <Link
                          to={`/organizer/events/${event.slug}/attendees`}
                          className="gap-2"
                        >
                          <Users size={12} /> Peserta
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all"
                      >
                        <Link
                          to={`/dashboard/events/${event.slug}/transactions`}
                          className="gap-2"
                        >
                          <Receipt size={12} /> Transaksi
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Sales Progress (Ticket Stub) */}
                  <div className="md:w-56 bg-zinc-50/50 p-8 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l md:border-dashed border-zinc-200">
                    <div className="w-full space-y-4">
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
                          Kapasitas
                        </p>
                        <p className="text-2xl font-black italic tracking-tighter text-zinc-900">
                          {event.totalSeats - event.availableSeats}
                          <span className="text-orange-500 text-sm">
                            /{event.totalSeats}
                          </span>
                        </p>
                      </div>

                      <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-zinc-900 h-full transition-all duration-1000 group-hover:bg-orange-500"
                          style={{
                            width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                          Penjualan
                        </span>
                        <span className="text-[10px] font-black text-orange-600 italic">
                          {Math.round(
                            ((event.totalSeats - event.availableSeats) /
                              event.totalSeats) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="mt-6 h-5 w-5 text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isPending && events?.data.length === 0 && (
            <Card className="border-2 border-dashed border-zinc-200 bg-white py-20 text-center rounded-[2rem]">
              <Ticket className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
              <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">
                Belum ada acara yang Anda buat.
              </p>
            </Card>
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-12">
          {!!events?.meta && (
            <PaginationSection
              meta={events.meta}
              onChangePage={(page) => setPage(page)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default MyEvents;
