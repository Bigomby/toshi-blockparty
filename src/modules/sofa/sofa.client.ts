import { ClientProxy } from '@nestjs/microservices';
import { RedisClient, createClient as CreateRedisClient } from 'redis';
import * as SOFA from 'sofa-js';

import { Config } from '../../config';

export class SOFAClient extends ClientProxy {
  private publisher = CreateRedisClient({ url: Config.REDIS.URI });

  protected sendSingleMessage({ pattern, data }) {
    this.publish({
      sofa: SOFA.Message({ body: data }).string,
      sender: Config.TOKEN.ID_ADDRESS,
      recipient: pattern,
    });
  }

  private publish(data) {
    this.publisher.publish(Config.TOKEN.ID_ADDRESS, JSON.stringify(data));
  }
}
