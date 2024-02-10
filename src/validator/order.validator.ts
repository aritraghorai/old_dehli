import { PAYMENT_GATEWAY } from '@/entities/order.entity.js';
import { z } from 'zod';

export const OrderBodyValidator = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.enum([
    PAYMENT_GATEWAY.CASH_ON_DELIVERY,
    PAYMENT_GATEWAY.RAZORPAY,
  ]),
});

export type OrderBody = z.infer<typeof OrderBodyValidator>;
