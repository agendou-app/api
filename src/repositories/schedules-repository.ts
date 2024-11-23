import { Prisma, Schedule } from '@prisma/client'

export interface SchedulesRepository {
  findById(id: string): Promise<Schedule | null>
  findBySlug(slug: string): Promise<Schedule | null>
  create(data: Prisma.ScheduleCreateInput): Promise<Schedule>
  update(id: string, data: Prisma.ScheduleUpdateInput): Promise<Schedule>
  remove(id: string): Promise<void>
}
