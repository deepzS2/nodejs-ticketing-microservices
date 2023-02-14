import { OrderStatus, OrderStatusType } from '@sgticketz/common'
import { Document, model, Model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  userId: string
  status: OrderStatusType[keyof OrderStatusType]
  price: number
  version: number
}

type OrderDoc = OrderAttrs & Document

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs, id?: string): OrderDoc
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
  price: {
    type: Number,
    required: true
  },
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

orderSchema.statics.build = (attrs: OrderAttrs, id?: string) => {
  return new Order({
    ...attrs,
    _id: id
  })
}

export const Order = model<OrderDoc, OrderModel>('Order', orderSchema)