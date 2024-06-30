import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootFolder = path.join(__dirname, '..');
export const clientFolder = path.join(rootFolder, 'client');
