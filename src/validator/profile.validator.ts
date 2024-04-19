import { z } from 'zod';

export const NewProfileValidator = z.object({
  fullName: z.string().min(3).max(255),
  bio: z.string().min(3).max(255),
  image: z.string().uuid(),
});
export const UpdateProfileValidator = z.object({
  fullName: z.string().min(3).max(255).optional(),
  bio: z.string().min(3).max(255).optional(),
  image: z.string().uuid().optional(),
});

export type NewProfile = z.infer<typeof NewProfileValidator>;
export type UpdateProfile = z.infer<typeof UpdateProfileValidator>;
