import * as pg from 'pg';

import {
  pgHost,
  pgPort,
  pgUser,
  pgPassword,
  pgDatabase,
} from '@/config/app';

export const pgPool = new pg.Pool({
  host: pgHost,
  port: pgPort,
  user: pgUser,
  password: pgPassword,
  database: pgDatabase,
});
