import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@gmtickets/common";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();

const isValidMongoId = (id: string) => mongoose.Types.ObjectId.isValid(id);

router.get(
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

    res.send(order);
  }
);

export { router as showOrderRouter };
