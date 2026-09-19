import { realpathSync } from 'node:fs';

// Keep Astro, Vite, and esbuild on the same path when the checkout is opened
// through a Windows junction. Resolve it before Astro reads its configuration.
process.chdir(realpathSync(process.cwd()));

// Run the installed CLI unchanged, forwarding all command-line arguments.
await import(new URL('./astro.js', import.meta.resolve('astro/package.json')).href);
