import { BadRequestError, validateRequest } from '@sgticketz/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { Password } from '../services/password'

const router = express.Router()

const validations = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().trim().withMessage('Password must be supplied')
]

router.post('/api/users/signin', validations, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body

  const doesUserExists = await User.findOne({ email })

  if (!doesUserExists) {
    throw new BadRequestError('Invalid credentials')
  }

  const doesPasswordsMatch = await Password.compare(doesUserExists.password, password)

  if (!doesPasswordsMatch) {
    throw new BadRequestError('Invalid credentials')
  }

  const userJwt = jwt.sign({
    id: doesUserExists.id,
    email: doesUserExists.email,
  }, process.env.JWT_KEY!)

  req.session = {
    jwt: userJwt
  }

  return res.status(200).send(doesUserExists)
})

export { router as signInRouter }