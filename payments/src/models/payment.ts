import { Document, model, Model, Schema } from 'mongoose'

interface PaymentAttrs {
  orderId: string
  stripeId: string
}

type PaymentDoc = PaymentAttrs & Document

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs, id?: string): PaymentDoc
}

const paymentSchema = new Schema<PaymentAttrs>({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      
      delete ret._id
    },
  }
})

paymentSchema.statics.build = (attrs: PaymentAttrs, id?: string) => {
  return new Payment({
    ...attrs,
    _id: id
  })
}

export const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema)