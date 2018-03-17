import { Module } from '@nestjs/common';

import { EthService } from './eth.service';

@Module({
  components: [EthService],
  exports: [EthService],
})
export class EthModule {}
