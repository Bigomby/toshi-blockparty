import { Component } from '@nestjs/common';

import { Config } from '../../config';

@Component()
export class WalletService {
  private readonly identityKey = Config.TOKEN.IDENTITY_KEY;
  private readonly paymentKey = Config.TOKEN.PAYMENT_KEY;

  public sign(data): string {
    return this.identityKey.sign(data);
  }
}
