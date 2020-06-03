import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@gmtickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
