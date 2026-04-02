import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  platform: {
    url: process.env.DATABASE_URL,
  },
  company: {
    user: process.env.COMPANY_DB_USER,
    password: process.env.COMPANY_DB_PASSWORD,
    host: process.env.COMPANY_DB_HOST,
    port: process.env.COMPANY_DB_PORT,
    name: process.env.COMPANY_DB_NAME,
  },
}));
