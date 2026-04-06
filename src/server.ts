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
setupGracefulShutdown(server, serverConfig.shutdownTimeout);

export default server;
