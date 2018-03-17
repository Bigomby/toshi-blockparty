import { Module } from '@nestjs/common';

import { SessionService } from './session.service';

@Module({
  components: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
