import { ClientProxy } from '@nestjs/microservices';

import { Config } from '../config';
import { RPCRequest } from '../utils/rpc-request';
import { JSONRPC, JSONRPCConnection } from '../utils/json-rpc';

export class WSClient extends ClientProxy {
  constructor(private readonly rpc: JSONRPCConnection) {
    super();
  }

  protected async sendSingleMessage(
    { pattern, data }: { pattern: string; data: any },
    callback: (err, result, disposed) => void,
  ) {
    try {
      const res = await this.rpc.request(pattern, data);
      callback(null, res, false);
      callback(null, null, true);
    } catch (e) {
      callback(e, null, true);
    }
  }
}
