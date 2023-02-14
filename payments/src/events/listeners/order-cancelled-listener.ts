import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@sgticketz/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const doesOrderExists = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    })
    
    if (!doesOrderExists) throw new Error('Order not found')

    doesOrderExists.set({ status: OrderStatus.Cancelled })
    await doesOrderExists.save()

    msg.ack()
  }
}