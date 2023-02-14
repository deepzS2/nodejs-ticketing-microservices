export const Subjects = {
  TicketCreated: 'ticket:created',
  OrderUpdated: 'order:updated',
} as const

export type SubjectsType = typeof Subjects