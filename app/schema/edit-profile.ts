import z from "zod";

export const editProfileSchema = z.object({
  photo: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Photo is required.")
    .refine((file) => file.type.startsWith("image/"), "File must be an image.")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Photo must be less than 5MB.",
    ),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
