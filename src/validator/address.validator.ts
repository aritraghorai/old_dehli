import { z } from 'zod';

export const addressValidator = z.object({
  name: z.string(),
  mobile: z.string(),
  alternatePhone: z.string().optional(),
  pincode: z.string().uuid(),
  locality: z.string(),
  address: z.string(),
  city: z.string(),
  landmark: z.string(),
  state: z.string(),
});


export const updateAddressValidator = z.object({
  name: z.string().optional(),
  mobile: z.string().optional(),
  alternatePhone: z.string().optional(),
  pincode: z.string().uuid().optional(),
  locality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  landmark: z.string().optional(),
  state: z.string().optional(),
});

export type updateAddressType = z.infer<typeof updateAddressValidator>;

export type addressType = z.infer<typeof addressValidator>;
