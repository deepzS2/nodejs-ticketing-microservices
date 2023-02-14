import type { SubjectsType } from "./subjects";
import { OrderStatusType } from "./types/order-status";

export interface OrderCreatedEvent {
  subject: SubjectsType['OrderCreated']
  data: {
    id: string
    status: OrderStatusType[keyof OrderStatusType]
    userId: string
    expiresAt: string
    version: number
    ticket: {
      id: string
      price: number
    }
  }
}