import { ExpirationCompleteEvent, OrderStatus } from "@sgticketz/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Mock } from "vitest";

import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  }, new Types.ObjectId().toHexString())
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  const msg = {
    ack: vi.fn()
  } as unknown as Message

  return { listener, msg, data, ticket, order }
}

it ('Updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('Emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  
  const eventData = JSON.parse((natsWrapper.client.publish as Mock).mock.calls[1][1])
  expect(eventData.id).toEqual(order.id)
})

it('Ack the message', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})