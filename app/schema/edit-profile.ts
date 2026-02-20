import z from "zod";

// Schema untuk update name & email
export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

// Schema untuk upload photo
export const uploadPhotoSchema = z.object({
  photo: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Photo is required.")
    .refine((file) => file.type.startsWith("image/"), "File must be an image.")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Photo must be less than 5MB.",
    ),
});

// Schema untuk change password
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Kata sandi lama diperlukan"),
    newPassword: z.string().min(8, "Minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
export type UploadPhotoSchema = z.infer<typeof uploadPhotoSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
