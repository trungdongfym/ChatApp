import express from 'express';
import http from 'http';
import {
   AppConfig,
   routerConfig,
   middlewareConfig,
   databaseConfig,
   passportConfig,
   socketIOConfig,
} from './configs';

const app = express();
const server = http.createServer(app);
const PORT = AppConfig.PORT || 3000;

databaseConfig();
middlewareConfig(app);
passportConfig(app);
socketIOConfig(server);
routerConfig(app);

server.listen(PORT, () => {
   const mode = process.env.NODE_ENV;
   console.log(`Running with mode: ${mode}`);
   console.log(`Listening on port: ${PORT}`);
});
