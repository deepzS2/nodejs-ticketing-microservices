import { Subjects, Publisher, ExpirationCompleteEvent } from "@sgticketz/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject = Subjects.ExpirationComplete
}