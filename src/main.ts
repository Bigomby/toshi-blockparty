import { NestFactory } from '@nestjs/core';

import { SofaServer } from './servers/sofa.server';
import { WSServer } from './servers/ws.server';
import { ApplicationModule } from './app.module';
import { JSONRPC } from './utils/json-rpc';

(async () => {
  const app = await NestFactory.create(ApplicationModule);

  app.connectMicroservice({
    strategy: new SofaServer(),
  });
  app.connectMicroservice({
    strategy: new WSServer(JSONRPC.connection),
  });

  app.startAllMicroservicesAsync();
  JSONRPC.connection.init();
})();
