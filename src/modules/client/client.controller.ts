import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common/services/logger.service';

import { SessionService } from '../session/session.service';
import { ClientService } from './client.service';
import { MessageDto } from './dtos/message.dto';

@Controller()
export class ClientController {
  protected readonly logger = new Logger('ClientController');

  constructor(
    private readonly sessionService: SessionService,
    private readonly clientService: ClientService,
  ) {}

  @MessagePattern({ type: 'Message' })
  public message(msg: MessageDto) {
    const session = this.sessionService.getSession(msg.sender);
    if (!session) {
      this.logger.warn(`Ignoring message. No session found for ${msg.sender}`);
      return;
    }

    const paymentAddress = session.getPaymentAddress();
    if (!paymentAddress) {
      this.logger.warn('User has not sent "Init" message');
      return;
    }

    this.clientService.sendMessage(msg.sender, msg.content.body);
  }

  @MessagePattern({ type: 'Init' })
  public init(msg: MessageDto) {
    this.logger.log(`New session created for ${msg.sender}`);
    this.sessionService.createSession(msg.sender, msg.content);
  }

  @MessagePattern({ type: 'InitRequest' })
  public initRequest(msg: MessageDto) {
    this.logger.warn(`Unimplemented: InitRequest`);
  }
}
