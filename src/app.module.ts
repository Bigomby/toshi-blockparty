import { Module } from '@nestjs/common';
import { ClientModule } from './modules/client/client.module';
import { IdentityModule } from './modules/identity/identity.module';
import { EthModule } from './modules/eth/eth.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [ClientModule, IdentityModule, EthModule, SessionModule],
})
export class ApplicationModule {}
