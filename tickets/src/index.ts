import 'express-async-errors'
import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

async function bootstrap() {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be specified')
  }
  
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be specified')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be specified')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be specified')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be specified')
  }

  try {
    mongoose.set('strictQuery', false)

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    await mongoose.connect(process.env.MONGO_URI)

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close)
    process.on('SIGTERM', () => natsWrapper.client.close)

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()
    
    console.log('Tickets service connected to MongoDB')
  } catch (err) {
    console.error(err)
  } finally {
    const PORT = 3000

    app.listen(PORT, () => {
      console.log(`Tickets service listening on port ${PORT}!`)
    })
  }
}

bootstrap()