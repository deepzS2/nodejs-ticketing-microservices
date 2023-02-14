import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { setup, teardown } from 'vitest-mongodb'

declare global {
  var __MONGO_URI__: string
  var signin: (id?: string) => string[]
}

vi.mock('../nats-wrapper.ts')

process.env.STRIPE_KEY = 'sk_test_51KYDkMDKUlTWtA70vwTjrLwBt9LmeegjEIPlETjsMrFSCqObnaK7xQfttib5Dss8rLsb2XlREAkuMoa2ffiG1nGh00QyG3jZ3j'

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'

  await setup()

  mongoose.set('strictQuery', false)
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

global.signin = (id?: string) => {
  const payload = {
    id: id ?? new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)

  const session = { jwt: token }

  const sessionJSON = JSON.stringify(session)

  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`session=${base64}`]
}