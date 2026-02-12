import z from "zod";

export const pointSchema = z.object({
  id: z.number(),
  amount: z.number(),
  remainingAmount: z.number(),
  expiredAt: z.string(),
});

export const couponSchema = z.object({
  id: z.number(),
  couponCode: z.string(),
  discountRate: z.coerce.number(),
  isUsed: z.boolean(),
  expiredAt: z.string(),
});

export const profileSchema = z.object({
  points: z.array(pointSchema).optional(),
  coupons: z.array(couponSchema).optional(),
});

export type Point = z.infer<typeof pointSchema>;
export type Coupon = z.infer<typeof couponSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
