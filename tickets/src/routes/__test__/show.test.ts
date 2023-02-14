import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

it('Returns a 404 if the ticket is not found', async () => {
  const id = new Types.ObjectId()

  await request(app)
    .get(`/api/tickets/${id.toHexString()}`)
    .send()
    .expect(404)
})

it('Returns the ticket if it is found', async () => {
  const title = 'title'
  const price = 20

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price
    })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)
  
  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
