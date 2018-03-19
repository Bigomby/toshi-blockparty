import { Module } from '@nestjs/common';

import { WSService } from './ws.service';

@Module({
  components: [WSService],
  exports: [WSService],
})
export class WSModule {}
