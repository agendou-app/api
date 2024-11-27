import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { ScheduleSameSlugError } from '@/errors/schedule-same-slug'
import { PrismaSchedulesRepository } from '@/repositories/prisma/prisma-schedules-repository'
import { UpdateScheduleUseCase } from '@/use-cases/schedules/update'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    about: z.string().optional(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    logoUrl: z.string().url().optional(),
    contact: z
      .object({
        email: z.string().email().optional(),
        phone: z
          .string()
          .regex(/^\d{10,11}$/)
          .optional(),
      })
      .optional(),
    address: z
      .object({
        id: z.string(),
        street: z.string().optional(),
        number: z.coerce.number().optional(),
        neighborhood: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z
          .string()
          .regex(/^\d{8}$/)
          .optional(),
        complement: z.string().optional().optional(),
      })
      .optional(),
  })

  const { id, name, about, slug, logoUrl, contact, address } =
    updateBodySchema.parse(request.body)

  try {
    const schedulesRepository = new PrismaSchedulesRepository()
    const updateScheduleUseCase = new UpdateScheduleUseCase(schedulesRepository)

    const { schedule } = await updateScheduleUseCase.execute({
      id,
      name,
      about,
      slug,
      logoUrl,
      contact,
      address,
    })

    return reply.status(200).send({ schedule })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: request.i18n.t('user_not_found'),
      })
    }

    if (err instanceof ScheduleSameSlugError) {
      return reply.status(409).send({
        message: request.i18n.t('schedule_same_slug'),
      })
    }

    throw err
  }
}
