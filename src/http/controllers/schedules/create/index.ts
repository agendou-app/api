import { FastifyReply, FastifyRequest } from 'fastify'

import { PrismaSchedulesRepository } from '@/repositories/prisma/prisma-schedules-repository'
import { CreateScheduleUseCase } from '@/use-cases/schedules/create'

import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserNotFoundError } from '@/errors/user-not-found'
import { ScheduleSameSlugError } from '@/errors/schedule-same-slug'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    logoUrl: z.string().url(),
    contact: z.object({
      email: z.string().email(),
      phone: z.string().regex(/^\d{10,11}$/),
    }),
    address: z
      .object({
        id: z.string().optional(),
        street: z.string(),
        number: z.coerce.number(),
        neighborhood: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string().regex(/^\d{8}$/),
        complement: z.string().optional(),
      })
      .optional(),
  })

  const { sub: userId } = request.user

  const { name, about, slug, logoUrl, contact, address } =
    createBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const schedulesRepository = new PrismaSchedulesRepository()
    const createScheduleUseCase = new CreateScheduleUseCase(
      usersRepository,
      schedulesRepository,
    )

    const { schedule } = await createScheduleUseCase.execute({
      userId,
      name,
      about,
      slug,
      logoUrl,
      contact,
      address,
    })

    return reply.status(201).send({ schedule })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
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
