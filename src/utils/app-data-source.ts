import { DataSource } from 'typeorm';
import env from './env.js';

const fileType = env.NODE_ENV === 'development' ? 'ts' : 'js';

const filePath = env.NODE_ENV === 'development' ? 'src' : 'dist';

console.log('filePath', filePath);

export const myDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  migrationsTableName: 'migrations',
  migrations: [`${filePath}/orm/migrations/*.${fileType}`],
  entities: [`${filePath}/entities/**/*.${fileType}`],
  logging: true,
  synchronize: false,
});
