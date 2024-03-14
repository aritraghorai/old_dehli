import { DataSource } from 'typeorm';
import env from './env.js';

export const myDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  migrationsTableName: 'migrations',
  migrations: ['src/orm/migrations/*.ts'],
  entities: ['src/entities/**/*.ts'],
  logging: true,
  synchronize: false,
});
