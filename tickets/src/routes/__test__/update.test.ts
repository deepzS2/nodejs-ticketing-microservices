import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('Returns a 404 if the provided id does not exists', async () => {
  const id = new Types.ObjectId().toHexString()

  await request(app)
    .post(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'title',
      price: 100
    })
    .expect(404)
})

it('Returns a 401 if the user is not authenticated', async () => {
  const id = new Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title',
      price: 100
    })
    .expect(401)
})

it('Returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'title',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'new title',
      price: 100
    })
    .expect(401)
})

it('Returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: '',
      price: 20
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'new title',
      price: -20
    })
    .expect(400)
})

it('Updates the ticket provided valid inputs', async () => {
  const cookie = signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10
    })

  const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 20
    })
    .expect(200)

  expect(ticketResponse.body.title).toEqual('new title')
  expect(ticketResponse.body.price).toEqual(20)
})

it('Publishes an event', async () => {
  const cookie = signin()
  
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 20
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('Rejects updates if the ticket is reserved', async () => {
  const cookie = signin()
  
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10
    })

  const ticket = await Ticket.findById(response.body.id)
  ticket!.set({ orderId: new Types.ObjectId().toHexString() })
  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 20
    })
    .expect(400)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})