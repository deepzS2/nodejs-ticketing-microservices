import { Publisher, OrderCreatedEvent, Subjects } from "@sgticketz/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject = Subjects.OrderCreated
}