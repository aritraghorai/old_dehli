import { z } from 'zod';

export const TimeSlotRequestSchema = z.object({
  startTime: z.coerce.date().transform(date => new Date(date)),
  endTime: z.coerce.date().transform(date => new Date(date)),
});

export type TimeSlotRequest = z.infer<typeof TimeSlotRequestSchema>;
