import mongoose from 'mongoose'
import request from 'supertest'
import { setup, teardown } from 'vitest-mongodb'

import { app } from '../app'

declare global {
  var __MONGO_URI__: string
  var signin: () => Promise<string[]>
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'

  await setup()

  await mongoose.connect(globalThis.__MONGO_URI__)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.close()
  await teardown()
})

global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}