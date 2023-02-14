import { Publisher, Subjects, SubjectsType, TicketUpdatedEvent } from '@sgticketz/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: SubjectsType['TicketUpdated'] = Subjects.TicketUpdated
}