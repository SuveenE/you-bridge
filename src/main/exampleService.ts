import http from 'http';
import exposeEndpointService from './services/exposeEndpointService';
import log from 'electron-log';

const PORT = 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route handling
  if (req.url === '/photos') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Photos endpoint',
    }));
  } else if (req.url === '/texts') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Texts endpoint',
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start the server
server.listen(PORT, async () => {
  log.info(`Server running at http://localhost:${PORT}`);

  try {
    // Expose both endpoints
    const photosUrl = await exposeEndpointService.exposePath(PORT, '/photos');
    const textsUrl = await exposeEndpointService.exposePath(PORT, '/texts');

    log.info('Exposed endpoints:');
    log.info(`Photos: ${photosUrl}`);
    log.info(`Texts: ${textsUrl}`);

    // Log all active tunnels
    const allUrls = exposeEndpointService.getAllTunnelUrls();
    log.info('All active tunnels:');
    allUrls.forEach((url, path) => {
      log.info(`${path}: ${url}`);
    });
  } catch (error) {
    log.error('Failed to expose endpoints:', error);
  }
});

// Handle cleanup on process exit
process.on('SIGINT', async () => {
  log.info('Shutting down...');
  await exposeEndpointService.killAllTunnels();
  server.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});

export default server;
