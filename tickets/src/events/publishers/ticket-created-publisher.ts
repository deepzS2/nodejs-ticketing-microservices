import { Publisher, Subjects, SubjectsType, TicketCreatedEvent } from '@sgticketz/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: SubjectsType['TicketCreated'] = Subjects.TicketCreated 
}