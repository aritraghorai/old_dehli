import { z } from 'zod';

export const PinCodeRequestBodySchema = z.object({
  pincode: z.coerce
    .number()
    .min(100000, 'Pincode must be 6 digits')
    .max(999999, 'Pincode must be 6 digits')
    .transform(val => val.toString()),
});

export type PinCodeRequestBody = z.infer<typeof PinCodeRequestBodySchema>;
