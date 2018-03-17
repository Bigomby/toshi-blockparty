import { Component } from '@nestjs/common';

class Session {
  constructor(private readonly paymentAddress: string) {}

  public getPaymentAddress() {
    return this.paymentAddress;
  }
}

@Component()
export class SessionService {
  private readonly sessions = new Map<string, Session>();

  public createSession(sender: string, data: any) {
    this.sessions.set(sender, new Session(data.paymentAddress));
  }

  public getSession(sender: string): Session {
    return this.sessions.get(sender);
  }
}
