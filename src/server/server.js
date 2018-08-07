let server = undefined;

/**
 * `local` env would start local server with files crated in memory.
 * Launching with other env (including `development`) will execute server.prod.
 */
if (process.env.NODE_ENV === 'local') {
  server = require('./serverApp/server.local');
} else {
  server = require('./serverApp/server.prod');
}

module.exports = server();
