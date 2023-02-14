import { TicketUpdatedEvent } from "@sgticketz/common"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = await Ticket.build({
    price: 10,
    title: 'concert',
  }, new Types.ObjectId().toHexString())

  await ticket.save()

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    price: 999,
    title: 'new concert',
    userId: new Types.ObjectId().toHexString(),
  }

  const msg = {
    ack: vi.fn()
  } as unknown as Message

  return { listener, data, ticket, msg }
}

it('Finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it ('Acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('Does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg, ticket } = await setup()

  data.version = 10

  expect(listener.onMessage(data, msg)).rejects.toThrow()
})