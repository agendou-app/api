import { UserNotFoundError } from '@/errors/user-not-found'
import { PrismaSchedulesRepository } from '@/repositories/prisma/prisma-schedules-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetAllSchedulesByUserUseCase } from '@/use-cases/schedules/get-all-by-user'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getAllByUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub: userId } = request.user

  try {
    const usersRepository = new PrismaUsersRepository()
    const schedulesRepository = new PrismaSchedulesRepository()
    const getAllByUserSchedulesUseCase = new GetAllSchedulesByUserUseCase(
      usersRepository,
      schedulesRepository,
    )

    const { schedules } = await getAllByUserSchedulesUseCase.execute({
      userId,
    })

    return reply.status(200).send({ schedules })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({
        message: request.i18n.t('resource_not_found'),
      })
    }

    throw err
  }
}
