import { createApp } from './app';
import { PORT } from './config'

const app = createApp();
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});