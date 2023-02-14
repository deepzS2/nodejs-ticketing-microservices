import { SubjectsType } from "./subjects";

export interface PaymentCreatedEvent {
  subject: SubjectsType['PaymentCreated']
  data: {
    id: string
    orderId: string
    stripeId: string
  }
}