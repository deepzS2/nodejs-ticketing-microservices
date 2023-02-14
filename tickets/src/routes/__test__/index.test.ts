import request from 'supertest'
import { app } from '../../app'

const createTicket = async (title: string, price: number) => await request(app)
  .post('/api/tickets')
  .set('Cookie', signin())
  .send({
    title,
    price
  })
  .expect(201)

it('Can fetch a list of tickets', async () => {
  await createTicket('title', 20)
  await createTicket('hello', 10)
  await createTicket('world', 30)

  const response = await request(app).get('/api/tickets').send().expect(200)

  expect(response.body).length.greaterThanOrEqual(3)
})
