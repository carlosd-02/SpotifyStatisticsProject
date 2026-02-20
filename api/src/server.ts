import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3001);

const app = createApp();
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});