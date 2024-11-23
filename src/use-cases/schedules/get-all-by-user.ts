import { Prisma } from '@prisma/client'
import { SchedulesRepository } from '@/repositories/schedules-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '@/errors/user-not-found'

interface Request {
  userId: string
}

interface Response {
  schedules: Prisma.ScheduleGetPayload<{
    include: {
      contact: true,
      address: true
    }
  }>[]
}


export class GetAllSchedulesByUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  async execute({
    userId,
  }: Request): Promise<Response> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      throw new UserNotFoundError()
    }

    const schedules = await this.schedulesRepository.findAllByUser(userId)

    return {
      schedules,
    }
  }
}
