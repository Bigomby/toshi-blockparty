import { Module } from '@nestjs/common';

import { IdentityService } from './identity.service';

@Module({
  components: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
