import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { RedisClient, createClient as CreateRedisClient } from 'redis';
import * as SOFA from 'sofa-js';

import { Config } from '../../config';

const MESSAGE_EVENT = 'message';
const ERROR_EVENT = 'error';
const CONNECT_EVENT = 'connect';
const PAYMENT_TYPE = 'payment';

export class SofaServer extends Server implements CustomTransportStrategy {
  private subscriber: RedisClient;

  public listen(callback: () => void) {
    this.subscriber = this.createRedisClient();

    this.subscriber.on(CONNECT_EVENT, () =>
      this.handleConnection(callback, this.subscriber),
    );
  }

  public close() {
    this.subscriber && this.subscriber.quit();
  }

  private handleConnection(callback: () => void, subscriber: RedisClient) {
    subscriber.on(MESSAGE_EVENT, this.handleMessage.bind(this));
    subscriber.subscribe(Config.TOKEN.ID_ADDRESS);
    callback && callback();
  }

  private handleMessage(__, data: string) {
    if (!data) return;

    try {
      const { sofa, sender, recipient } = JSON.parse(data);
      if (recipient !== Config.TOKEN.ID_ADDRESS) return;

      const msg = SOFA.parse(sofa);
      if (!msg || !msg.type) return;

      if (msg.type === PAYMENT_TYPE) {
        this.logger.warn(`Ignoring "SOFA:Payment" message from chat \
          message: expecting Ethereum Service Notification soon`);
        return;
      }

      const pattern = JSON.stringify({ type: msg.type });
      const handler = this.messageHandlers[pattern];
      handler && handler({ content: msg.content, sender });
    } catch (e) {
      this.logger.error(e);
    }
  }

  private createRedisClient(): RedisClient {
    const client = CreateRedisClient(Config.REDIS.URI);
    client.on(ERROR_EVENT, err => this.logger.error(err));
    return client;
  }
}
