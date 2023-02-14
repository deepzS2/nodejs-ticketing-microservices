import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
  public readonly statusCode = 400

  constructor(public readonly errors: ValidationError[]) {
    super('Invalid request parameters')

    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map(err => ({ message: err.msg, field: err.param }))
  }
}