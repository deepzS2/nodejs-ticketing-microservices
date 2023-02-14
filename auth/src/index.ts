import 'express-async-errors'
import mongoose from 'mongoose'

import { app } from './app'

async function bootstrap() {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be specified')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be specified')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Authentication service connected to MongoDB')
  } catch (err) {
    console.error(err)
  } finally {
    const PORT = 3000

    app.listen(PORT, () => {
      console.log(`Authentication service listening on port ${PORT}!`)
    })
  }
}

bootstrap()