import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  public readonly statusCode = 500
  public readonly reason = 'Error connecting to database'

  constructor() {
    super('Error connecting to database')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}