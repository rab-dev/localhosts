import pino from 'pino';
import http from 'http';
import httpProxy from 'http-proxy';
import fs from 'fs';

// Create a logger
const logger = pino({
  level: 'info'
});

// Create an HTTP proxy server
const proxy = httpProxy.createProxyServer();

// Initialize the hostToPortMap
let hostToPortMap = new Map();

// Function to read and update the hostToPortMap
function readHostToPortMap() {
  fs.promises.readFile('localhosts', 'utf8')
    .then(data => {
      const lines = data.trim().split('\n');
      const newMap = new Map();
      lines.forEach(line => {
        if (!line.startsWith('#')) {
          const [hostname, port] = line.split(' ');
          newMap.set(hostname, port);
        }
      });
      hostToPortMap = newMap;
      logger.info('localhosts file loaded');
    })
    .catch(error => {
      logger.error({"msg" : "error reading localhosts file", "error": error});
    });
}

// Read the initial hostToPortMap
readHostToPortMap();

// Create an HTTP server to handle incoming requests
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.headers.host} ${req.url}`);

  // Get the HOST header from the request
  const host = req.headers.host;

  // Check if the HOST header matches a known host in the map
  if (hostToPortMap.has(host)) {
    // Proxy the request to the corresponding server
    const targetPort = hostToPortMap.get(host);
    if (!targetPort) {
        logger.error(`ERR no port ${host}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('No Localhosts Port');
    } else {
        proxy.web(req, res, { target: `http://localhost:${targetPort}` }, 
            (error) => {
                if (error) {
                    logger.error(`ERR ${req.method} ${req.headers.host} ${req.url} ${error.message}`)
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(JSON.stringify({ 'message': error.message, "error": error }));
                }
            }
        )
    }
  } else {
    logger.error(`ERR unknown host ${host}`)
    // Handle requests for unknown hosts
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Unknown Localhosts Host');
  }
});

// Watch for changes to the localhosts file using fs.watchFile
fs.watchFile('localhosts', (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    logger.info(`localhosts file has changed, reloading...`);
    readHostToPortMap();
  }
});

// Listen on port 80 (or the desired port)
const port = 80;
server.listen(port, '0.0.0.0', () => {
  console.log(`Localhosts listening on ${port}`);
});
