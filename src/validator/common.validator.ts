import { z } from 'zod';

export const praramIdValidator = z.object({
  id: z.string().uuid(),
});
