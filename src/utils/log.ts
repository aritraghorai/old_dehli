import { pino } from 'pino';
import dayjs from 'dayjs';

const Log = pino({
  base: {
    pid: false,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default Log;
