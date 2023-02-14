import { Subjects, Publisher, PaymentCreatedEvent } from "@sgticketz/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject = Subjects.PaymentCreated
}