import type { SubjectsType } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: SubjectsType['ExpirationComplete']
  data: {
    orderId: string
  }
}