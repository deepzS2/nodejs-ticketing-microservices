import type { Stan } from "node-nats-streaming";

import type { SubjectsType } from "./subjects";

interface Event {
  subject: SubjectsType[keyof SubjectsType]
  data: any
}

export abstract class Publisher<T extends Event> {
  abstract readonly subject: T['subject']

  constructor(protected client: Stan) {}

  publish(data: T['data']) {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err)
        }

        return resolve()
      })
    })
  }
}