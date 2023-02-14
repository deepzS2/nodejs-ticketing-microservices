import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@sgticketz/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const doesOrderExists = await Order.findById(data.orderId)

    if (!doesOrderExists) throw new Error('Order not found')
    
    doesOrderExists.set({ status: OrderStatus.Complete })
    await doesOrderExists.save()

    msg.ack()
  }
}