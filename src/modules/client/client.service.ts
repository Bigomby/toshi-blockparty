import { Component } from '@nestjs/common';

import { SOFAClient } from '../../clients/sofa.client';

@Component()
export class ClientService {
  private readonly sofaClient = new SOFAClient();

  public sendMessage(address: string, msg: string) {
    this.sofaClient.send(address, msg).toPromise();
  }
}
