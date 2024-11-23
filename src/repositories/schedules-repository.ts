import { Prisma, Schedule } from '@prisma/client'

type ScheduleWithContactAndAddress = Prisma.ScheduleGetPayload<{
  include: {
    contact: true
    address: true
  }
}>

export interface SchedulesRepository {
  findById(id: string): Promise<Schedule | null>
  findBySlug(slug: string): Promise<Schedule | null>
  findAllByUser(userId: string): Promise<ScheduleWithContactAndAddress[]>
  create(data: Prisma.ScheduleCreateInput): Promise<Schedule>
  update(id: string, data: Prisma.ScheduleUpdateInput): Promise<Schedule>
  remove(id: string): Promise<void>
}
