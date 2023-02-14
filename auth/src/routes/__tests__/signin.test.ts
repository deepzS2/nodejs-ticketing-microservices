import request from 'supertest'

import { app } from '../../app'
import { User } from '../../models/user'

const createUser = async () => {
  const user = await User.build({
    email: 'test@test.com',
    password: 'password'
  })

  await user.save()

  return user
}

it('Fails when a email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})

it('Fails when an incorrect password is supplied', async () => {
  const user = await createUser()

  await request(app)
    .post('/api/users/signin')
    .send({
      email: user.email,
      password: 'asdsadsaf'
    })
    .expect(400)
})

it('Responds with a cookie when given valid credentials', async () => {
  const user = await createUser()

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: user.email,
      password: 'password'
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})