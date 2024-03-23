import { z } from 'zod';

export const productQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  shop: z.string().optional(),
});
export const NewProductBodyValidator = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  productTags: z.array(z.string().uuid()).optional(),
  categoryId: z.string().uuid(),
  shopId: z.string().uuid(),
  price: z.number().positive(),
  productType: z.string().uuid(),
  timeSlot: z.string().uuid(),
  minOrderQuantity: z.coerce
    .number()
    .positive()
    .transform(val => +val),
});

export const ProductAndProductTagParamValidator = z.object({
  productId: z.string().uuid(),
  productTagId: z.string().uuid(),
});

export const ProductItemValidator = z.object({
  sku: z.string().min(3).max(20),
  stock: z.coerce
    .number()
    .positive()
    .transform(val => +val),
  price: z.coerce
    .number()
    .positive()
    .transform(val => +val),
  images: z.array(z.string().uuid()).optional(),
  optionValues: z.array(z.string().uuid()).optional(),
  weight: z.coerce
    .number()
    .positive()
    .transform(val => +val),
});

export const UpdateProductRequestBodyValidator = z.object({
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(3).max(255).optional(),
  slug: z.string().min(3).max(255).optional(),
  price: z.coerce
    .number()
    .positive()
    .optional()
    .transform(val => +val),
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  productType: z.string().uuid().optional(),
  timeSlot: z.string().uuid().optional(),
  minOrderQuantity: z.coerce
    .number()
    .positive()
    .optional()
    .transform(val => +val),
});

export const UpdateProductItemValidator = z.object({
  sku: z.string().min(3).max(20),
  stock: z.coerce
    .number()
    .positive()
    .transform(val => +val),
  price: z.coerce
    .number()
    .positive()
    .transform(val => +val),
  optionValues: z.array(z.string().uuid()).optional(),
  weight: z.coerce
    .number()
    .positive()
    .optional()
    .transform(val => +val),
});

export type UpdateProductRequestBody = z.infer<
  typeof UpdateProductRequestBodyValidator
>;
export type UpdateProductItemBody = z.infer<typeof UpdateProductItemValidator>;

export type NewProductItem = z.infer<typeof ProductItemValidator>;

export type ProductAndProductTagParam = z.infer<
  typeof ProductAndProductTagParamValidator
>;

export type NewProductBody = z.infer<typeof NewProductBodyValidator>;

export type ProductQuery = z.infer<typeof productQuerySchema>;
