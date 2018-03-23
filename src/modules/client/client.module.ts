import { Module } from '@nestjs/common';

import { SessionModule } from '../session/session.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { EthModule } from '../eth/eth.module';

@Module({
  imports: [SessionModule, EthModule],
  controllers: [ClientController],
  components: [ClientService],
})
export class ClientModule {}
