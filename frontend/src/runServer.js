import { createServer } from 'vite';
import react from "@vitejs/plugin-react";
import path from 'node:path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = async () => {
  const vite = await createServer({
    plugins: [react()],
    configFile: false,
    root: path.resolve(__dirname, '../dist'),
  });
  await vite.listen();
};

export default app;
