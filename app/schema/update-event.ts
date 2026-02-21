import * as z from "zod";

export const updateEventSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters.")
      .max(255)
      .optional(),
    description: z.string().min(1, "Description is required.").optional(),
    location: z.string().min(1, "Location is required.").optional(),
    price: z.number().min(0, "Price cannot be negative.").optional(),
    totalSeats: z.number().min(1, "Total seats must be at least 1.").optional(),
    startDate: z.string().min(1, "Start date is required.").optional(),
    endDate: z.string().min(1, "End date is required.").optional(),
    image: z
      .instanceof(File, { message: "Event banner image is required." })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
