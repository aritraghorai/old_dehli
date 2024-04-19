import { z } from 'zod';
import dayjs from 'dayjs';

export const TimeSlotRequestSchema = z.object({
  startTime: z.coerce.date().transform(date => dayjs(date).toDate()),
  endTime: z.coerce.date().transform(date => dayjs(date).toDate()),
});

export type TimeSlotRequest = z.infer<typeof TimeSlotRequestSchema>;
