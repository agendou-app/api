import { Prisma, Schedule } from '@prisma/client'
import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { ScheduleSameSlugError } from '@/errors/schedule-same-slug'
import { SchedulesRepository } from '@/repositories/schedules-repository'

interface Request {
  id: string
  name?: string
  about?: string
  slug?: string
  logoUrl?: string
  contact?: Prisma.ContactUpdateWithoutScheduleInput
  address?: Prisma.AddressUpdateWithoutScheduleInput
}

interface Response {
  schedule: Schedule
}

export class UpdateScheduleUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

  async execute({
    id,
    name,
    about,
    slug,
    logoUrl,
    contact,
    address,
  }: Request): Promise<Response> {
    const scheduleExists = await this.schedulesRepository.findById(id)

    if (!scheduleExists) {
      throw new ResourceNotFoundError()
    }

    if (slug) {
      const scheduleWithSameSlug =
        await this.schedulesRepository.findBySlug(slug)

      if (scheduleWithSameSlug) {
        throw new ScheduleSameSlugError()
      }
    }

    const schedule = await this.schedulesRepository.update(id, {
      name,
      about,
      slug,
      logoUrl,
      contact: {
        update: {
          where: {
            id: contact?.id as string | undefined,
          },
          data: {
            phone: contact?.phone,
            email: contact?.email,
          },
        },
      },
      address: {
        update: {
          where: {
            id: address?.id as string | undefined,
          },
          data: {
            street: address?.street,
            number: address?.number,
            neighborhood: address?.neighborhood,
            city: address?.city,
            state: address?.state,
            zipCode: address?.zipCode,
            complement: address?.complement,
          },
        },
      },
    })

    return { schedule }
  }
}
