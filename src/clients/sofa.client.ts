import { ClientProxy } from '@nestjs/microservices';
import { RedisClient, createClient as CreateRedisClient } from 'redis';
import * as SOFA from 'sofa-js';

import { Config } from '../config';

const ID_KEY = Config.TOKEN.IDENTITY_KEY.address;

export class SOFAClient extends ClientProxy {
  private readonly publisher = CreateRedisClient({ url: Config.REDIS.URI });

  protected sendSingleMessage({ pattern, data }) {
    this.publish({
      sofa: SOFA.Message({ body: data }).string,
      sender: ID_KEY,
      recipient: pattern,
    });
  }

  private publish(data) {
    this.publisher.publish(ID_KEY, JSON.stringify(data));
  }
}
