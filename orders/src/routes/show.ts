import { NotAuthorizedError, NotFoundError, requireAuth } from '@sgticketz/common'
import { Request, Router, Response } from 'express'
import { Order } from '../models/order'

const router = Router()

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const doesOrderExists = await Order.findById(req.params.orderId).populate('ticket')

  if (!doesOrderExists) throw new NotFoundError()
  if (doesOrderExists.userId !== req.currentUser!.id) throw new NotAuthorizedError()

  res.send(doesOrderExists)
})

export { router as showOrderRouter }