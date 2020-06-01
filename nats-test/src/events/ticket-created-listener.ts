import {Message, Stan} from 'node-nats-streaming';
import { Listener } from './base-listener';
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  constructor(client: Stan) {
    super(client)
  }

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event Data!', data);

    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}

export default TicketCreatedListener;