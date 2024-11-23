import { Prisma, Schedule } from '@prisma/client'
import { ScheduleSameSlugError } from '@/errors/schedule-same-slug'
import { SchedulesRepository } from '@/repositories/schedules-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '@/errors/user-not-found'

interface Request {
  userId: string
  name: string
  about: string
  slug: string
  logoUrl: string
  contact: Prisma.ContactCreateWithoutScheduleInput
  address: Prisma.AddressCreateWithoutScheduleInput
}

interface Response {
  schedule: Schedule
}

export class CreateScheduleUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  async execute({
    userId,
    name,
    about,
    slug,
    logoUrl,
    contact,
    address,
  }: Request): Promise<Response> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      throw new UserNotFoundError()
    }

    const scheduleWithSameSlug = await this.schedulesRepository.findBySlug(slug)

    if (scheduleWithSameSlug) {
      throw new ScheduleSameSlugError()
    }

    const schedule = await this.schedulesRepository.create({
      name,
      about,
      slug,
      logoUrl,
      user: {
        connect: {
          id: userId,
        },
      },
      contact: {
        create: {
          phone: contact.phone,
          email: contact.email,
        },
      },
      address: {
        connectOrCreate: {
          where: {
            id: address.id,
          },
          create: {
            street: address.street,
            number: address.number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            complement: address.complement,
          },
        },
      },
    })

    return {
      schedule,
    }
  }
}
