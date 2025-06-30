import { z } from 'zod';

export const NewZoneValidator = z.object({
  name: z.string().min(3).max(50),
  deliveryCharges: z.coerce
    .number()
    .min(0)
    .transform(val => +val),
  minOrderValue: z.coerce
    .number()
    .min(0)
    .transform(val => +val),
  pincodes: z.array(z.string().uuid()).optional(),
  products: z.array(z.string().uuid()).optional(),
});

export type NewZone = z.infer<typeof NewZoneValidator>;
