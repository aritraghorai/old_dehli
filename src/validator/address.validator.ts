import { z } from 'zod';

export const addressValidator = z.object({
  name: z.string(),
  mobile: z.string(),
  alternatePhone: z.string().optional(),
  pincode: z.string(),
  locality: z.string(),
  address: z.string(),
  city: z.string(),
  landmark: z.string(),
  state: z.string(),
});
export type addressType = z.infer<typeof addressValidator>;
