import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import env from './env.js';

const config: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  url: env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/orm/migrations/**/*.ts'],
  subscribers: ['src/orm/subscriber/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default config;
