import { UsersRepository } from '@/repositories/users-repository'
import { User, Role } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { UserAlreadyExistsError } from '@/errors/user-already-exists'

interface Request {
  name: string
  email: string
  password: string
  role?: Role
}

interface Response {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password, role }: Request): Promise<Response> {
    const password_hash = await bcryptjs.hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role,
    })

    return {
      user,
    }
  }
}
