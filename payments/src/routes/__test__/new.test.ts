import { OrderStatus } from '@sgticketz/common'
import { Types } from 'mongoose'
import request from 'supertest'
import { Mock } from 'vitest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { stripe } from '../../stripe'

it('Returns a 404 when purchasing an order that does not exists', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'token',
      orderId: new Types.ObjectId().toHexString()
    })
    .expect(404)
})

it("Returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    userId: new Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'token',
      orderId: order.id
    })
    .expect(401)
})

it('Returns a 400 when purchasing a cancelled order', async () => {
  const userId = new Types.ObjectId().toHexString()
  const order = Order.build({
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'token',
      orderId: order.id
    })
    .expect(400)
})

it('Returns a 201 with valid inputs', async () => {
  const userId = new Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100_000)
  const order = Order.build({
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 50 })
  const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100)

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  })
  expect(payment).not.toBeNull()
})