import 'dotenv/config';
import  {Server}  from './src/server/Server.js';

const server = new Server();

server.start();

process.on('SIGTERM', () => {
  server.stop().catch(console.error);
});

process.on('SIGINT', () => {
  server.stop().catch(console.error);
});


