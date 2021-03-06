import { Module } from '@nestjs/common';
import { ClientModule } from './modules/client/client.module';
import { IdentityModule } from './modules/identity/identity.module';
import { EthModule } from './modules/eth/eth.module';
import { SessionModule } from './modules/session/session.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    ClientModule,
    EthModule,
    IdentityModule,
    SessionModule,
    WalletModule,
  ],
})
export class ApplicationModule {}
