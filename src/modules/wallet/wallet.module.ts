import { Module } from '@nestjs/common';

import { WalletService } from './wallet.service';

@Module({
  components: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
