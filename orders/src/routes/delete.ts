import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@sgticketz/common'
import { Request, Router, Response } from 'express'

import { Order } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params

  const doesOrderExists = await Order.findById(orderId).populate('ticket')

  if (!doesOrderExists) throw new NotFoundError()
  if (doesOrderExists.userId !== req.currentUser!.id) throw new NotAuthorizedError()

  doesOrderExists.status = OrderStatus.Cancelled
  await doesOrderExists.save()

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: doesOrderExists.id,
    version: doesOrderExists.version,
    ticket: {
      id: doesOrderExists.ticket.id,
    }
  })

  res.status(204).send(doesOrderExists)
})

export { router as deleteOrderRouter }