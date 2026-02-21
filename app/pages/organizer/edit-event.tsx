import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, redirect, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  FileText,
  ImageIcon,
  MapPin,
  Save,
  Users,
  PencilLine,
  Ticket,
} from "lucide-react";

import { useAuth } from "~/stores/useAuth";
import useGetEventBySlug from "~/hooks/api/useGetEventBySlug";
import useUpdateEvent from "~/hooks/api/useUpdateEvent";
import {
  updateEventSchema,
  type UpdateEventSchema,
} from "~/schema/update-event";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ORGANIZER") return redirect("/");
};

const toLocalDatetime = (iso: string) =>
  new Date(iso).toISOString().slice(0, 16);

const toNumber = (val: string) => (val === "" ? 0 : Number(val));

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditEvent() {
  const { slug } = useParams<{ slug: string }>();

  const { data: event, isPending: isLoading } = useGetEventBySlug(slug!);

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      price: 0,
      totalSeats: 100,
      startDate: "",
      endDate: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (!event) return;
    form.reset({
      name: event.name,
      description: event.description ?? "",
      location: event.location ?? "",
      price: event.price,
      totalSeats: event.totalSeats,
      startDate: toLocalDatetime(event.startDate),
      endDate: toLocalDatetime(event.endDate),
      image: undefined,
    });
  }, [event, form]);

  const { mutate: updateEvent, isPending } = useUpdateEvent(event?.id ?? 0);

  function onSubmit(data: UpdateEventSchema) {
    updateEvent(data);
  }

  // ─── Loading State ────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-zinc-50/50">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
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

              {/* Edit Mode badge — pembeda utama dari Create Event */}
              <div className="flex items-center gap-2 mb-2">
                <PencilLine className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Edit Event
                </span>
              </div>

              {/* Judul menampilkan nama event yang sedang diedit */}
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none">
                Ubah{" "}
                <span className="relative text-orange-500">
                  {event?.name ?? "Event"}
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-orange-200 rounded-full" />
                </span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-3">
                Perbarui informasi event. Perubahan tersimpan setelah kamu
                menekan tombol simpan.
              </p>

              {/* Dashed divider — penanda visual "sedang dalam mode edit" */}
              <div className="mt-5 border-t-2 border-dashed border-zinc-200" />
            </div>

            {/* ── Form ─────────────────────────────────────────────────── */}
            <form
              id="form-edit-event"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pb-20"
            >
              <div className="grid gap-8 lg:grid-cols-3">
                {/* ── Kiri ─────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Event Information */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                      <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                        <FileText className="h-5 w-5 text-orange-500" />
                        Informasi Event
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Nama Event *
                            </FieldLabel>
                            <Input
                              {...field}
                              id="name"
                              aria-invalid={fieldState.invalid}
                              className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold tracking-tight"
                              placeholder="Masukkan nama event"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Deskripsi Event
                            </FieldLabel>
                            <Textarea
                              {...field}
                              id="description"
                              aria-invalid={fieldState.invalid}
                              className="rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium min-h-[200px]"
                              placeholder="Ceritakan detail tentang acara Anda..."
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="location"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Lokasi Venue
                            </FieldLabel>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                              <Input
                                {...field}
                                id="location"
                                aria-invalid={fieldState.invalid}
                                className="pl-12 h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold"
                                placeholder="Gedung, Kota, atau Link Zoom"
                              />
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Schedule */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                      <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                        <Calendar className="h-5 w-5 text-orange-500" />
                        Waktu & Jadwal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid gap-6 sm:grid-cols-2">
                      <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Waktu Mulai *
                            </FieldLabel>
                            <Input
                              {...field}
                              id="startDate"
                              type="datetime-local"
                              aria-invalid={fieldState.invalid}
                              className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold uppercase text-[11px]"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="endDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Waktu Selesai *
                            </FieldLabel>
                            <Input
                              {...field}
                              id="endDate"
                              type="datetime-local"
                              aria-invalid={fieldState.invalid}
                              className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold uppercase text-[11px]"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* ── Kanan ────────────────────────────────────────────── */}
                <div className="space-y-8">
                  {/* Ticket Setting */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden relative">
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2" />
                    <CardHeader className="bg-zinc-900 text-white">
                      <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-orange-500" />
                        Pengaturan Tiket
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 mt-4">
                      <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-[10px] font-black uppercase text-zinc-400">
                              Harga (IDR)
                            </FieldLabel>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-orange-600 italic">
                                Rp
                              </span>
                              <Input
                                id="price"
                                type="number"
                                className="pl-12 h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-black italic text-lg"
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(toNumber(e.target.value))
                                }
                              />
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="totalSeats"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-[10px] font-black uppercase text-zinc-400">
                              Total Kursi
                            </FieldLabel>
                            <div className="relative">
                              <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                              <Input
                                id="totalSeats"
                                type="number"
                                className="pl-12 h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-black italic text-lg"
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(toNumber(e.target.value))
                                }
                              />
                            </div>
                            <p className="text-[10px] text-zinc-400 font-medium italic mt-2 leading-relaxed">
                              * Kapasitas tersedia akan disetel sesuai total
                              kursi.
                            </p>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Banner Event */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-900 italic">
                        Banner Event
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Preview banner lama — hanya ada di halaman Edit */}
                      {event?.image && (
                        <div className="overflow-hidden rounded-2xl border border-zinc-100 relative">
                          <img
                            src={event.image}
                            alt="Current event banner"
                            className="h-36 w-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/80">
                              Banner saat ini
                            </p>
                          </div>
                        </div>
                      )}

                      <Controller
                        name="image"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <div
                              className={cn(
                                "group relative flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed transition-all p-8",
                                field.value
                                  ? "border-orange-500 bg-orange-50/10"
                                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "p-4 rounded-full mb-3 transition-transform group-hover:scale-110",
                                  field.value
                                    ? "bg-orange-500 text-white"
                                    : "bg-white text-zinc-400 shadow-sm",
                                )}
                              >
                                <ImageIcon className="h-6 w-6" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">
                                {field.value
                                  ? (field.value as File).name
                                  : event?.image
                                    ? "Ganti Banner"
                                    : "Upload Banner"}
                              </p>
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) field.onChange(file);
                                }}
                              />
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      form="form-edit-event"
                      disabled={isPending}
                      className="w-full bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 shadow-xl shadow-zinc-200 transition-all active:scale-95 font-black uppercase text-xs tracking-[0.2em] italic"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Menyimpan...
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4 text-orange-500" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                      asChild
                      disabled={isPending}
                    >
                      <Link to="/organizer/events">Batal & Buang</Link>
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
}
