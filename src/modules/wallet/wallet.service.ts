import { Component } from '@nestjs/common';

import { Config } from '../../config';

@Component()
export class WalletService {
  private readonly identityKey = Config.TOKEN.IDENTITY_KEY;
  private readonly paymentKey = Config.TOKEN.PAYMENT_KEY;

  public getIdentityAddress(): string {
    return this.identityKey.address;
  }

  public getPaymentAddress(): string {
    return this.paymentKey.address;
  }

  public sign(data): string {
    return this.identityKey.sign(data);
  }
}
