import { DataSource } from 'typeorm';
import env from './env.js';

console.log(process.env);

export const myDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  migrationsTableName: 'migrations',
  migrations: ['src/orm/migrations/*.ts'],
  entities: ['src/entities/**/*.ts'],
  logging: true,
  synchronize: false,
});
