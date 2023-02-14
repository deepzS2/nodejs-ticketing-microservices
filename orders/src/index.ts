import 'express-async-errors'
import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'

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

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()
    
    console.log('Orders service connected to MongoDB')
  } catch (err) {
    console.error(err)
  } finally {
    const PORT = 3000

    app.listen(PORT, () => {
      console.log(`Orders service listening on port ${PORT}!`)
    })
  }
}

bootstrap()