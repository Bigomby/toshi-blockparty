import { Component } from '@nestjs/common';
import * as BN from 'bn.js';
import * as Web3 from 'web3';

import { WalletService } from '../wallet/wallet.service';
import { WSClient } from '../../clients/ws.client';
import { JSONRPC } from '../../utils/json-rpc';

@Component()
export class EthService {
  private readonly web3 = new Web3();
  private readonly wsClient = new WSClient(JSONRPC.connection);

  constructor(private readonly walletService: WalletService) {}

  public async getBalance(address: string): Promise<string> {
    const res = await this.wsClient.send('get_balance', [address]).toPromise();
    const confirmedBalance = res['confirmed_balance'];

    if (!confirmedBalance) return;

    const parsedBalance =
      confirmedBalance.startsWith('0x') || confirmedBalance.startsWith('0X')
        ? confirmedBalance.slice(2)
        : confirmedBalance;

    const weiBalance = new BN(parsedBalance, 'hex');
    const etherBalance = this.web3.utils.fromWei(weiBalance, 'ether');

    return parseFloat(etherBalance)
      .toFixed(4)
      .toString();
  }
}
