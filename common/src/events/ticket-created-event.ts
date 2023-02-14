import type { SubjectsType } from "./subjects"

export interface TicketCreatedEvent {
  subject: SubjectsType['TicketCreated']
  data: {
    id: string
    title: string
    price: number
    userId: string
    version: number
  }
}