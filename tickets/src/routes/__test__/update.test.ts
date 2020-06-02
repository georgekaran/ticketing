import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdasdas",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdasdas",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "asdasdas",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "sasafdas",
      price: 30,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const userCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userCookie)
    .send({
      title: "asdasdas",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "SASAFAS",
      price: 0,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const userCookie = global.signin();

  const responsePost = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userCookie)
    .send({
      title: "Title 1",
      price: 20,
    });

  const responsePut = await request(app)
    .put(`/api/tickets/${responsePost.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "Title 2",
      price: 30,
    })
    .expect(200);

  expect(responsePut.body.title).toBe("Title 2");
  expect(responsePut.body.price).toBe(30);
});

it("publishes an event", async () => {
  const userCookie = global.signin();

  const responsePost = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userCookie)
    .send({
      title: "Title 1",
      price: 20,
    });

  const responsePut = await request(app)
    .put(`/api/tickets/${responsePost.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "Title 2",
      price: 30,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it("rejects updates if the ticket is reserved", async () => {
  const userCookie = global.signin();

  const { body: ticket } = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", userCookie)
    .send({
      title: "Title 1",
      price: 20,
    });

  const createdTicket = await Ticket.findById(ticket.id);
  createdTicket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await createdTicket!.save();

  const responsePut = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "Title 2",
      price: 30,
    })
    .expect(400);
});
