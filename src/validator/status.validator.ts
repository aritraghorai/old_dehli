import { z } from "zod";

export const NewStatusValidator = z.object({
  name: z.string(),
  video_url: z.string().url(),
  description: z.string(),
})

export type NewStatus = z.infer<typeof NewStatusValidator>;

export const UpdateStatusValidator = z.object({
  name: z.string().optional(),
  video_url: z.string().optional(),
  description: z.string().optional(),
})

export type UpdateStatus = z.infer<typeof UpdateStatusValidator>;
