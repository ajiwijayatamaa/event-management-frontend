import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.email({ error: "invalid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["CUSTOMER", "ORGANIZER"]),
  referrerCode: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
