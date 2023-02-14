import { OrderStatus } from '@sgticketz/common'
import { Document, model, Model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

import { Order } from './order'

interface TicketAttrs {
  title: string
  price: number
}

export type TicketDoc = TicketAttrs & Document & {
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs, id?: string): TicketDoc
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new Schema<TicketAttrs>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      
      delete ret._id
    },
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs, id?: string) => {
  return new Ticket({
    ...attrs,
    _id: id
  })
}

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

ticketSchema.methods.isReserved = async function() {
  const doesOrderExists = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete]
    }
  })

  return !!doesOrderExists
}

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)