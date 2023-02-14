import { Publisher, OrderCancelledEvent, Subjects } from "@sgticketz/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject = Subjects.OrderCancelled  
}