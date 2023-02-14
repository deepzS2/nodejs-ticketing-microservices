import type { SubjectsType } from "./subjects";

export interface OrderCancelledEvent {
  subject: SubjectsType['OrderCancelled']
  data: {
    id: string
    version: number
    ticket: {
      id: string
    }
  }
}