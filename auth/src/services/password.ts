import { scrypt as oldScrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(oldScrypt)

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex')

    const buf = (await scrypt(password, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(hashedPassword: string, suppliedPassword: string) {
    const [hash, salt] = hashedPassword.split('.')

    const buf = (await scrypt(suppliedPassword, salt, 64)) as Buffer

    return buf.toString('hex') === hash
  }
}