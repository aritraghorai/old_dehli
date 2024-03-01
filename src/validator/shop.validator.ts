import { z } from 'zod';
import { queryPageValidator } from './common.validator.js';

export const shopQuerySchema = z.intersection(
  queryPageValidator,
  z.object({
    search: z.string().optional(),
  }),
);

export const NewShopValidator = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  images: z.array(z.string().uuid()).optional(),
});

export const updateShopValidator = z.object({
  isActive: z.boolean().optional(),
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(3).max(255).optional(),
  images: z.array(z.string().uuid()).optional(),
});

export type UpdateShopValidatorType = z.infer<typeof updateShopValidator>;

export type NewShopValidatorType = z.infer<typeof NewShopValidator>;

export type ShopQuery = z.infer<typeof shopQuerySchema>;
