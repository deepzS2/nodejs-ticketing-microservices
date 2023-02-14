import { OrderStatus } from '@sgticketz/common'
import { Types } from 'mongoose'
import request from 'supertest'

import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('Returns an error if the ticket does not exists', async () => {
  const ticketId = new Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(404)
})

it('Returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })

  await ticket.save()

  const order = Order.build({
    ticket,
    userId: new Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
  })

  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('Reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('Emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})