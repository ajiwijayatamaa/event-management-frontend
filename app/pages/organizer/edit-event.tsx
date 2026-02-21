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
} from "lucide-react";

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
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  // 1. Ambil data event yang sudah ada
  const { data: eventData, isLoading } = useGetEventById(eventId);
  const event = eventData?.data;

  // 2. Setup form
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

  // 3. Isi form setelah data event selesai di-fetch
  useEffect(() => {
    if (!event) return;

    // Konversi ISO string → format datetime-local (YYYY-MM-DDTHH:mm)
    const toLocalDatetime = (iso: string) =>
      new Date(iso).toISOString().slice(0, 16);

    form.reset({
      name: event.name,
      description: event.description ?? "",
      location: event.location ?? "",
      price: event.price,
      totalSeats: event.totalSeats,
      startDate: toLocalDatetime(event.startDate),
      endDate: toLocalDatetime(event.endDate),
      image: undefined, // file input selalu kosong; image lama tetap dipakai bila tidak diubah
    });
  }, [event, form]);

  // 4. Mutation
  const { mutate: updateEvent, isPending } = useUpdateEvent(eventId);

  function onSubmit(data: UpdateEventSchema) {
    updateEvent(data);
  }

  // ─── Loading State ────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <OrganizerSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </main>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

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
                Edit Event
              </h1>
              <p className="text-muted-foreground">
                Update the details of your event.
              </p>
            </div>

            {/* FORM */}
            <form
              id="form-edit-event"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pb-20"
            >
              <div className="grid gap-8 lg:grid-cols-3">
                {/* ── Kiri ────────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Event Information */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Event Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Name */}
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name">Event Name *</FieldLabel>
                            <Input
                              {...field}
                              id="name"
                              aria-invalid={fieldState.invalid}
                              placeholder="Enter event name"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* Description */}
                      <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="description">
                              Description
                            </FieldLabel>
                            <Textarea
                              {...field}
                              id="description"
                              aria-invalid={fieldState.invalid}
                              placeholder="Tell people what this event is about..."
                              rows={8}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* Location */}
                      <Controller
                        name="location"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                id="location"
                                aria-invalid={fieldState.invalid}
                                placeholder="Physical venue or link"
                                className="pl-10"
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
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      {/* Start Date */}
                      <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="startDate">
                              Start Date & Time *
                            </FieldLabel>
                            <Input
                              {...field}
                              id="startDate"
                              type="datetime-local"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* End Date */}
                      <Controller
                        name="endDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="endDate">
                              End Date & Time *
                            </FieldLabel>
                            <Input
                              {...field}
                              id="endDate"
                              type="datetime-local"
                              aria-invalid={fieldState.invalid}
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

                {/* ── Kanan ───────────────────────────────────────────────── */}
                <div className="space-y-6">
                  {/* Ticket Setting */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket Setting</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Price */}
                      <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="price">Price (Rp)</FieldLabel>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                Rp
                              </span>
                              <Input
                                id="price"
                                type="number"
                                className="pl-10"
                                aria-invalid={fieldState.invalid}
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ""}
                                placeholder="Masukkan harga Ticket"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* Total Seats */}
                      <Controller
                        name="totalSeats"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="totalSeats">
                              Total Seats *
                            </FieldLabel>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="totalSeats"
                                type="number"
                                className="pl-10"
                                aria-invalid={fieldState.invalid}
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ""}
                                placeholder="Isi Total Bangku"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
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

                  {/* Event Banner */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Event Banner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Preview image lama dari Cloudinary */}
                      {event?.image && (
                        <div className="overflow-hidden rounded-lg border border-border">
                          <img
                            src={event.image}
                            alt="Current event banner"
                            className="h-36 w-full object-cover"
                          />
                          <p className="px-3 py-1.5 text-[10px] text-muted-foreground italic bg-muted/50">
                            Current banner — upload a new image to replace it.
                          </p>
                        </div>
                      )}

                      {/* File input untuk ganti image (opsional) */}
                      <Controller
                        name="image"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 transition-colors hover:bg-muted">
                              <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                              <p className="mt-2 text-xs font-medium text-center">
                                {field.value
                                  ? (field.value as File).name
                                  : event?.image
                                    ? "Click to replace image"
                                    : "Upload Event Image"}
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
                      size="lg"
                      className="w-full"
                      disabled={isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                      disabled={isPending}
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
}
