import { OrderStatus, OrderStatusType } from '@sgticketz/common'
import { Document, model, Model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { TicketDoc } from './ticket'

interface OrderAttrs {
  userId: string
  status: OrderStatusType[keyof OrderStatusType]
  expiresAt: Date
  ticket: TicketDoc 
}

type OrderDoc = OrderAttrs & Document & {
  version: number
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema<OrderAttrs>({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created 
  },
  expiresAt: {
    type: Schema.Types.Date,
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      
      delete ret._id
    },
  }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

export const Order = model<OrderDoc, OrderModel>('Order', orderSchema)