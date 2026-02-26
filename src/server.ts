import dotenv from 'dotenv';
import { createApp } from '@/utils/app';
import {
  serverConfig,
  setupGracefulShutdown,
  startServer,
} from '@/utils/server-lifecycle';

// Load environment variables
dotenv.config();

// Create application instance
const app = createApp();

// Start server and setup graceful shutdown
const server = startServer(app, serverConfig);
setupGracefulShutdown(server, serverConfig.shutdownTimeout);

export default server;
