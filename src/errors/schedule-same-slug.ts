export class ScheduleSameSlugError extends Error {
  constructor() {
    super('Schedule with the same slug already exists.')
  }
}
