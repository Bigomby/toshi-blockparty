import { Module } from '@nestjs/common';

import { EthService } from './eth.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  components: [EthService],
  exports: [EthService],
})
export class EthModule {}
