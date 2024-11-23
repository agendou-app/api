import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import bycryptjs from 'bcryptjs'
import { InvalidCredentialsError } from '@/errors/invalid-credentials'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await bycryptjs.compare(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
