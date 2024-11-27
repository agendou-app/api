import { Prisma } from '@prisma/client'
import { SchedulesRepository } from '../schedules-repository'
import { prisma } from '@/lib/prisma'

export class PrismaSchedulesRepository implements SchedulesRepository {
  async findById(id: string) {
    const schedule = await prisma.schedule.findUnique({
      where: {
        id,
      },
    })

    return schedule
  }

  async findByIdAndUserId(id: string, userId: string) {
    const schedule = await prisma.schedule.findUnique({
      where: {
        id,
        userId,
      },
    })

    return schedule
  }

  async findBySlug(slug: string) {
    const schedule = await prisma.schedule.findUnique({
      where: {
        slug,
      },
    })

    return schedule
  }

  async findAllByUser(userId: string) {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
      },
      include: {
        contact: true,
        address: true,
      },
    })

    return schedules
  }

  async create(data: Prisma.ScheduleCreateInput) {
    const schedule = await prisma.schedule.create({
      data,
    })

    return schedule
  }

  async update(id: string, data: Prisma.ScheduleUpdateInput) {
    const schedule = await prisma.schedule.update({
      where: {
        id,
      },
      data,
      include: {
        contact: true,
        address: true,
      },
    })

    return schedule
  }

  async remove(id: string) {
    await prisma.schedule.delete({
      where: {
        id,
      },
    })
  }
}
