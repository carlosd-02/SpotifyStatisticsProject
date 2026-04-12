import dotenv from 'dotenv';
dotenv.config()

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const PORT = Number(process.env.PORT ?? 3001);
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY ?? "";