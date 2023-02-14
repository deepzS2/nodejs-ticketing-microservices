import type { SubjectsType } from "./subjects"

export interface TicketUpdatedEvent {
  subject: SubjectsType['TicketUpdated']
  data: {
    id: string
    title: string
    price: number
    userId: string
    version: number
    orderId?: string
  }
}