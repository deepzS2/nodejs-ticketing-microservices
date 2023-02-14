import { OrderCancelledEvent, OrderStatus } from "@sgticketz/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    price: 99,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    version: 1,
    id: order.id,
    ticket: {
      id: new Types.ObjectId().toHexString(),
    }
  }

  const msg = {
    ack: vi.fn()
  } as unknown as Message

  return { listener, data, msg, order }
}

it('Updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('Acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})