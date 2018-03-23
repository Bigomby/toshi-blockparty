import * as WebSocket from 'ws';

import { PrivateKey } from './private-key';
import { Config } from '../config';
import { RPCRequest } from './rpc-request';
import { EventEmitter } from 'events';

const SIGNATURE_METHOD = 'GET';
const SIGNATURE_PATH = '/v1/ws';

const WS_OPEN_EVENT = 'open';
const WS_CLOSE_EVENT = 'close';
const WS_MESSAGE_EVENT = 'message';
const WS_SUBSCRIBE_EVENT = 'subscribe';

const PAYMENT_KEY = Config.TOKEN.PAYMENT_KEY;
const PAYMENT_SERVICE_URL = `${Config.PAYMENT_SERVICE.URL}/v1/ws`;

export class JSONRPC {
  private static instance: JSONRPCConnection;

  public static get connection(): JSONRPCConnection {
    if (!this.instance) {
      this.instance = new JSONRPCConnection(PAYMENT_SERVICE_URL, PAYMENT_KEY);
    }

    return this.instance;
  }
}

export class JSONRPCConnection extends EventEmitter {
  close(): any {
    throw new Error('Method not implemented.');
  }
  private readonly requests = new Map<number, any>();
  private ws: WebSocket;

  constructor(private readonly url: string, private readonly key: PrivateKey) {
    super();
  }

  public init() {
    const now = getUnixTimestamp(Date.now());
    const headers = buildHeaders(now, this.key);

    this.ws = new WebSocket(this.url, null, { headers });
    this.ws.on(WS_OPEN_EVENT, () => this.emit(WS_OPEN_EVENT));
    this.ws.on(WS_MESSAGE_EVENT, this.onMessage.bind(this));
  }

  public request(method: string, params: any): Promise<any> {
    const req = RPCRequest.Create(method, params);

    return new Promise((resolve, reject) => {
      this.ws.send(req.stringify(), err => {
        if (err) throw err;

        this.requests.set(req.id, { resolve, reject });
      });
    });
  }

  public subscribe(params: any) {
    const req = RPCRequest.Create(WS_SUBSCRIBE_EVENT, params);

    this.ws.send(req.stringify(), err => {
      if (err) throw err;
    });
  }

  private onMessage(data: string) {
    const msg = JSON.parse(data);

    if (msg.jsonrpc !== '2.0') {
      throw Error(`Unknown JSON-RPC version: ${msg.jsonrpc}`);
    }

    if (msg.id) {
      this.handleResponse(msg);
    } else {
      this.handleNotification(msg);
    }
  }

  private handleResponse(msg) {
    if (!this.requests.has(msg.id)) {
      throw Error(`Response to unknown request: ${msg.id}`);
    }

    const { resolve, reject } = this.requests.get(msg.id);
    this.requests.delete(msg.id);

    msg.error && reject(msg.error);
    msg.result && resolve(msg.result);
  }

  private handleNotification(msg) {
    this.emit(msg.method, msg);
  }
}

function getUnixTimestamp(date: number): number {
  return Math.floor(date / 1000);
}

function generateSignature(timestamp: number, key: PrivateKey): string {
  return key.sign(`${SIGNATURE_METHOD}\n${SIGNATURE_PATH}\n${timestamp}\n`);
}

function buildHeaders(
  timestamp: number,
  key: PrivateKey,
): { [key: string]: string } {
  return {
    'Toshi-ID-Address': key.address,
    'Toshi-Timestamp': timestamp.toString(),
    'Toshi-Signature': generateSignature(timestamp, key),
  };
}
