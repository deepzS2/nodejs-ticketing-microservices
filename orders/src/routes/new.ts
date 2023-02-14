import { Request, Router, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sgticketz/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

const validations = [body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('TicketId must be provided')]

const EXPIRATION_WINDOW_SECONDS = 15 * 60 // 15 minutes

router.post('/api/orders', requireAuth, validations, validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body

  const doesTicketExists = await Ticket.findById(ticketId)

  if (!doesTicketExists) throw new NotFoundError()

  const isReserved = await doesTicketExists.isReserved()

  if (isReserved) throw new BadRequestError(`Ticket is already reserved`)

  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  const order = Order.build({
    userId: req.currentUser!.id,
    expiresAt: expiration,
    status: OrderStatus.Created,
    ticket: doesTicketExists
  })
  await order.save()

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    version: order.version,
    expiresAt: order.expiresAt.toISOString(),
    userId: order.userId,
    ticket: {
      id: doesTicketExists.id,
      price: doesTicketExists.price
    }
  })

  res.status(201).send(order)
})

export { router as newOrderRouter }