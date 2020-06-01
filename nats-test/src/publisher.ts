import nats from 'node-nats-streaming';
import TicketCreatedPublisher from "./events/ticket-created-publisher";

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
      userId: '12opeqwopdqwd'
    })
  } catch (e) {
    console.error(e);
  }


  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });
  //
  // client.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // })
});