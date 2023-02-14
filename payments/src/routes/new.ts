import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sgticketz/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'

import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { natsWrapper } from '../nats-wrapper'
import { stripe } from '../stripe'

const router = express.Router()

const validation = [
  body('token').not().isEmpty().withMessage('Token is required'), 
  body('orderId').not().isEmpty().withMessage('Order ID is required'), 
]

router.post('/api/payments', requireAuth, validation, validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body

  const doesOrderExists = await Order.findById(orderId)

  if (!doesOrderExists) throw new NotFoundError()
  if (doesOrderExists.userId !== req.currentUser!.id) throw new NotAuthorizedError()
  if (doesOrderExists.status === OrderStatus.Cancelled) throw new BadRequestError('Cannot pay for an cancelled order')

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: doesOrderExists.price * 100,
    source: token
  })
  
  const payment = await Payment.build({
    orderId,
    stripeId: charge.id
  })
  await payment.save()

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  })

  res.status(201).send({ id: payment.id })
})

export { router as createChargeRouter }