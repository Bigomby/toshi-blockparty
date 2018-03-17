import { Module } from '@nestjs/common';

import { SessionModule } from '../session/session.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [SessionModule],
  controllers: [ClientController],
  components: [ClientService],
})
export class ClientModule {}
