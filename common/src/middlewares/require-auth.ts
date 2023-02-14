import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from '../errors/not-authorized-error'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError()
  }

  next()
}