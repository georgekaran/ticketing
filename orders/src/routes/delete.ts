import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@gmtickets/common";
import { Order, OrderStatus } from "../models/order";
import mongoose from "mongoose";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const isValidMongoId = (id: string) => mongoose.Types.ObjectId.isValid(id);

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.orderId)) {
      throw new BadRequestError("Invalid order id");
    }

    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send({});
  }
);

export { router as deleteOrderRouter };
