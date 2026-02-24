import { createServer } from 'vite';

async function startServer() {
  try {
    const server = await createServer({
      configFile: './vite.config.ts',
      root: './'
    });
    
    await server.listen();
    console.log('Development server started successfully!');
    console.log('Visit the server at:', server.config.server.host || 'localhost', ':', server.config.server.port || 5173);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
