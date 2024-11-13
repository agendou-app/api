import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/errors/user-already-exists'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserUseCase } from '@/use-cases/users/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const RoleSchema = z.enum(['ADMINISTRATOR', 'USER'])
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: RoleSchema.optional(),
  })

  const { name, email, password, role } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUserUseCase(usersRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
      role,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: request.i18n.t('user_already_exists'),
      })
    }

    throw err
  }

  return reply.status(201).send()
}
