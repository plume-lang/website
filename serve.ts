import { serve } from "bun";
import chalk from "chalk";
import path from "path";
import { LogLevel, log, customLog } from "#library/logger.ts";

const server = serve({
  port: process.env.SERVER_PORT || 3002,
  hostname: process.env.SERVER_HOST || 'localhost',
  async fetch(request) {
    const { method } = request;
    const { pathname } = new URL(request.url);

    if (method !== 'HEAD' && method !== 'GET') {
      log(LogLevel.ERROR, `Method ${method} not allowed at ${pathname}`);
      return new Response('Method not allowed', { status: 405 });
    }

    const distPath = path.resolve(path.dirname(Bun.main), "dist");

    if (/\/_astro\/.*\.(js|css)/g.test(pathname)) {
      log(LogLevel.INFO, `Requested route at ${pathname}`);
      const asset = Bun.file(path.resolve(distPath, pathname.slice(1)));
      const assetStr = await asset.text();

      const ext = pathname.split('.').pop();
      if (ext === 'js') {
        customLog('ASSET', `Served Astro Javascript asset at ${pathname}`);
        return new Response(assetStr, { headers: { 'Content-Type': 'application/javascript' } });
      }
      if (ext === 'css') {
        customLog('ASSET', `Served Astro CSS asset at ${pathname}`);
        return new Response(assetStr, { headers: { 'Content-Type': 'text/css' } });
      }

      log(LogLevel.ERROR, `Asset type not supported at ${pathname}`);
      return new Response('Not found', { status: 404 });
    } else if (pathname === '/') {
      log(LogLevel.INFO, `Requested route at ${pathname}`);
      const index = Bun.file(path.resolve(distPath, 'index.html'));
      const indexStr = await index.text();
      customLog('ROOT', `Served index.html at ${pathname}`);

      return new Response(indexStr, { headers: { 'Content-Type': 'text/html' } });
    } else if (pathname.startsWith('/assets/')) {
      log(LogLevel.INFO, `Requested route at ${pathname}`);
      const assetName = pathname.match(/\/assets\/(.+)/)?.[1];
      if (!assetName) return new Response('Not found', { status: 404 });

      const asset = Bun.file(path.resolve(distPath, 'assets', assetName));
      const assetStr = await asset.text();

      const ext = assetName.split('.').pop();
      if (ext === 'js') {
        customLog('ASSET', `Served Javascript asset at ${pathname}`);
        return new Response(assetStr, { headers: { 'Content-Type': 'application/javascript' } });
      }
      if (ext === 'css') {
        customLog('ASSET', `Served CSS asset at ${pathname}`);
        return new Response(assetStr, { headers: { 'Content-Type': 'text/css' } });
      }
      
      log(LogLevel.ERROR, `Asset type not supported at ${pathname}`);
      return new Response('Not found', { status: 404 });
    } else if (pathname === '/favicon.svg') {
      const logo = Bun.file(path.resolve(distPath, 'favicon.svg'));
      const logoStr = await logo.text();

      customLog('ASSET', `Served SVG asset ${pathname}`);
      return new Response(logoStr, { headers: { 'Content-Type': 'image/svg+xml' } });
    }

    log(LogLevel.ERROR, `Route not found at ${pathname}`);

    const index = Bun.file(path.resolve(distPath, 'index.html'));
    const indexStr = await index.text();
    return new Response(indexStr, { status: 404, headers: { 'Content-Type': 'text/html' } });
  },
});

console.log(`${chalk.green('START')}: Running at http://${server.hostname}:${server.port}`);