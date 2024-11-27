import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { SchedulesRepository } from '@/repositories/schedules-repository'

interface Request {
  userId: string
  scheduleId: string
}

export class RemoveScheduleUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

  async execute({ userId, scheduleId }: Request): Promise<void> {
    const scheduleExists = await this.schedulesRepository.findByIdAndUserId(
      scheduleId,
      userId,
    )

    if (!scheduleExists) {
      throw new ResourceNotFoundError()
    }

    await this.schedulesRepository.remove(scheduleId)
  }
}
