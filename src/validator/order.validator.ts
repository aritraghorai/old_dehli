import { PAYMENT_GATEWAY, PAYMENT_STATUS } from '@/entities/order.entity.js';
import { ORDER_STATUS } from '@/utils/Constant.js';
import { z } from 'zod';

export const OrderBodyValidator = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.enum([
    PAYMENT_GATEWAY.CASH_ON_DELIVERY,
    PAYMENT_GATEWAY.RAZORPAY,
  ]),
});

export const UpdateOrderBodyValidator = z.object({
  status: z
    .enum([
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.PROCESSING,
    ])
    .optional(),
  paymentStatus: z
    .enum([PAYMENT_STATUS.SUCCESS, PAYMENT_STATUS.PENDING])
    .optional(),
});

export type UpdateOrderBody = z.infer<typeof UpdateOrderBodyValidator>;

export type OrderBody = z.infer<typeof OrderBodyValidator>;
