import { TicketCreatedEvent } from "@sgticketz/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new Types.ObjectId().toHexString(),
    price: 10,
    title: 'concert',
    userId: new Types.ObjectId().toHexString(),
  }

  const msg = {
    ack: vi.fn()
  } as unknown as Message

  return { listener, data, msg }
}

it('Creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it ('Acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})