import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { PrismaSchedulesRepository } from '@/repositories/prisma/prisma-schedules-repository'
import { RemoveScheduleUseCase } from '@/use-cases/schedules/remove'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const removeScheduleParamsSchema = z.object({
    scheduleId: z.string().uuid(),
  })

  const { sub: userId } = request.user
  const { scheduleId } = removeScheduleParamsSchema.parse(request.params)

  try {
    const schedulesRepository = new PrismaSchedulesRepository()
    const removeScheduleUseCase = new RemoveScheduleUseCase(schedulesRepository)

    await removeScheduleUseCase.execute({ userId, scheduleId })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: request.i18n.t('resource_not_found'),
      })
    }

    throw err
  }
}
