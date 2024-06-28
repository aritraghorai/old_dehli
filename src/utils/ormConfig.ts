import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import env from './env.js';

const config: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  url: env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: ['src/entities/**/*.@(ts|js)]'],
  migrations: ['src/orm/migrations/**/*.@(ts|js)'],
  subscribers: ['src/orm/subscriber/**/*.@(ts|js)'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default config;
