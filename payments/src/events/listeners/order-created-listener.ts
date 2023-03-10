import { Listener, OrderCreatedEvent, Subjects } from "@sgticketz/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    }, data.id)
    await order.save()

    msg.ack()
  }
}