import { Prisma, Schedule } from '@prisma/client'
import { ScheduleSameSlugError } from '@/errors/schedule-same-slug'
import { SchedulesRepository } from '@/repositories/schedules-repository'

interface Request {
  name: string
  about: string
  slug: string
  logoUrl: string
  contact: Prisma.ContactCreateWithoutScheduleInput,
  address: Prisma.AddressCreateWithoutScheduleInput
}

interface Response {
  schedule: Schedule
}

export class CreateScheduleUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

  async execute({ name, about, slug, logoUrl, contact, address }: Request): Promise<Response> {
    const scheduleWithSameSlug = await this.schedulesRepository.findBySlug(slug)

    if (scheduleWithSameSlug) {
      throw new ScheduleSameSlugError()
    }

    const schedule = await this.schedulesRepository.create({
      name,
      about,
      slug,
      logoUrl,
      contact: {
        create: {
          phone: contact.phone,
          email: contact.email
        }
      },
      address: {
        connectOrCreate: {
          where: {
            id: address.id
          },
          create: {
            street: address.street,
            number: address.number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            complement: address.complement
          }
        }
      },
    })

    return {
      schedule,
    }
  }
}
