import { Server, CustomTransportStrategy } from '@nestjs/microservices';

import { JSONRPC, JSONRPCConnection } from '../utils/json-rpc';
import { Config } from '../config';

const PAYMENT_ADDRESS = Config.TOKEN.PAYMENT_KEY.address;

const WS_OPEN_EVENT = 'open';
const WS_CLOSE_EVENT = 'close';

export class WSServer extends Server implements CustomTransportStrategy {
  constructor(private readonly rpc: JSONRPCConnection) {
    super();
  }

  public listen(callback: () => void) {
    this.rpc.on(WS_OPEN_EVENT, () => {
      this.rpc.subscribe([PAYMENT_ADDRESS]);
      this.rpc.on(PAYMENT_ADDRESS, this.onMessage.bind(this));
      this.rpc.on(WS_CLOSE_EVENT, this.onClose.bind(this));

      this.logger.log(`Listening for payments to ${PAYMENT_ADDRESS}`);
    });
  }

  public close() {
    this.rpc.close();
  }

  private onMessage(message: string) {
    console.log(message);
  }

  private onClose() {
    console.log('WebSocket connection closed');
  }
}
