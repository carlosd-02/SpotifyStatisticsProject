import dotenv from 'dotenv';
dotenv.config()

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export type AppConfig = {
  openWeatherKey?: string;
  port: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    openWeatherKey: env.OPENWEATHER_API_KEY, // read when called
    port: Number(env.PORT ?? 3001),
  };
}