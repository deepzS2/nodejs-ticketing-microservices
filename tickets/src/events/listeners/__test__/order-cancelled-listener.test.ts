import { OrderCancelledEvent, OrderStatus } from "@sgticketz/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Mock } from "vitest"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = new Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: new Types.ObjectId().toHexString(),
    orderId
  })

  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    version: 0,
    id: new Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id
    }
  }

  const msg = {
    ack: vi.fn()
  } as unknown as Message

  return { listener, data, msg, ticket, orderId }
}

it('Updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})