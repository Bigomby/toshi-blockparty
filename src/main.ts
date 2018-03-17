import { NestFactory } from '@nestjs/core';

import { SofaServer } from './modules/sofa/sofa.server';
import { ApplicationModule } from './app.module';

(async () => {
  const app = await NestFactory.createMicroservice(ApplicationModule, {
    strategy: new SofaServer(),
  });

  app.listen(null);
})();
