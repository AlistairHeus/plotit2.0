import "dotenv/config";
import "@/common/demitrei/demitrei.subscriber";
import { createApp } from "@/utils/app";
import {
  serverConfig,
  setupGracefulShutdown,
  startServer,
} from "@/utils/server-lifecycle";

// Create application instance
const app = createApp();

// Start server and setup graceful shutdown
const server = startServer(app, serverConfig);

// Increase timeouts for long-running AI streams
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 65000; 
server.headersTimeout = 66000;

setupGracefulShutdown(server, serverConfig.shutdownTimeout);

export default server;
