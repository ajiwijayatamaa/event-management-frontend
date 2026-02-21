import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Receipt,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Link, redirect, useNavigate } from "react-router"; // 1. Import useNavigate
import { useDebounceValue } from "usehooks-ts";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import PaginationSection from "~/components/pagination-section";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import useGetEvents from "~/hooks/api/useGetEvents";
import { useAuth } from "~/stores/useAuth";
import { formatDate, formatDateShort } from "~/utils/formatter";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

//dapetin id dari organizer tentukan ticket ini punya id ini ticket ini punya id ini

const MyEvents = () => {
  const navigate = useNavigate();

  // Menggunakan nuqs untuk sinkronisasi state 'page' ke URL (URL-state management), Install NUQS DULU
  // agar data tetap bertahan saat halaman direfresh atau link dibagikan.
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  // Debounce Logic: Update state 'search' 500ms setelah user berhenti ngetik
  const [debouncedValue] = useDebounceValue(search, 500);

  const {
    data: events,
    isPending,
    isError,
  } = useGetEvents({
    page,
    take: 3,
    search: debouncedValue,
  });

  // Fungsi helper untuk navigasi ke detail event
  const handleCardClick = (slug: string) => {
    // Sesuaikan dengan route kamu: /events/:id (atau :slug)
    navigate(`/events/${slug}`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <OrganizerSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Acara Saya</h1>
            <p className="text-muted-foreground">
              Kelola detail acara, pantau peserta, dan verifikasi transaksi.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/organizer/events/create">
              <Plus className="mr-2 h-4 w-4" /> Buat Acara
            </Link>
          </Button>
        </div>

        {/* SEARCH INPUT */}
        <div className="mb-6 relative max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
          <Input
            className="pl-10 pr-10 border-border/60 focus-visible:ring-blue-600"
            type="text"
            placeholder="Cari Event Anda Disini"
            onChange={(e) => setSearch(e.target.value)}
            value={search} // untuk menampung nilai search agar saat website di refresh tidak hilang
          />
        </div>
        <div className="space-y-4">
          {isPending && (
            <div className="text-center py-20 text-muted-foreground animate-pulse">
              Memuat data acara...
            </div>
          )}
          {isError && (
            <div className="text-center py-20 text-destructive">
              Gagal mengambil data acara.
            </div>
          )}

          {events?.data.map((event) => (
            <Card
              key={event.id}
              // 3. Tambahkan onClick handler di Card utama
              onClick={() => handleCardClick(event.slug)}
              // 4. Tambahkan cursor-pointer dan hover effect biar user tau bisa diklik
              className="overflow-hidden border-border/60 shadow-sm cursor-pointer hover:border-blue-400 transition-all hover:shadow-md"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full md:w-52 h-40 shrink-0 bg-muted">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Konten Utama */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-blue-600">
                          {event.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-mono"
                        >
                          {event.slug}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-blue-500" />
                          {event.location}
                        </div>
                        {/* Info Tanggal Event (Mulai) */}
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-blue-500" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        {/* --- Tanggal Pembuatan Event --- */}
                        <div className="flex items-center gap-1.5 italic text-[11px] text-muted-foreground">
                          <Clock size={14} className="text-gray-400" />
                          <span>
                            Dibuat: {formatDateShort(event.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <Ticket size={14} className="text-blue-500" />
                          Rp {Number(event.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                      {/*  Nama Organizer */}
                      <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2 text-[11px]  tracking-wider font-semibold text-blue-600/70">
                        <Users size={12} />
                        Dibuat oleh:{" "}
                        <span className="capitalize">
                          {event.organizer.name}
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex flex-wrap gap-2 mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 gap-1.5"
                      >
                        <Link to={`/organizer/events/edit/${event.slug}`}>
                          <Settings size={14} /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 gap-1.5 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Link
                          to={`/dashboard/events/${event.slug}/participants`}
                        >
                          <Users size={14} /> Peserta
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <Link
                          to={`/dashboard/events/${event.slug}/transactions`}
                        >
                          <Receipt size={14} /> Transaksi
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Progress Penjualan */}
                  <div className="md:w-44 bg-muted/20 p-5 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/50">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                        <span>Penjualan</span>
                        <span>
                          {Math.round(
                            ((event.totalSeats - event.availableSeats) /
                              event.totalSeats) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all"
                          style={{
                            width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center">
                        {event.totalSeats - event.availableSeats} /{" "}
                        {event.totalSeats} Kursi Terjual
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isPending && events?.data.length === 0 && (
            <Card className="border-dashed py-20 text-center">
              <p className="text-muted-foreground">
                Belum ada acara yang dibuat.
              </p>
            </Card>
          )}
        </div>

        {/* Kita mau tampilin paginaitonSectionnya kalau event.metanya ada, baru kita mau tampilin*/}
        {!!events?.meta && (
          <PaginationSection
            meta={events.meta}
            onChangePage={(page) => setPage(page)}
          />
        )}
      </main>
    </div>
  );
};

export default MyEvents;
