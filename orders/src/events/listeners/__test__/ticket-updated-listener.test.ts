import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@gmtickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'Movie',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { listener, data, msg, ticket };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call the onMessage function with the data obj + message obj
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created.
  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toBe(data.title);
  expect(updatedTicket!.price).toBe(data.price);
  expect(updatedTicket!.version).toBe(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data obj + message obj
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async (done) => {
  const { msg, data, ticket, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return done();
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
