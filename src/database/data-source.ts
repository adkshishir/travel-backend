import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ALL_ENTITIES } from './entities';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export default new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: ALL_ENTITIES,
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: true,
  logging: false,
});
