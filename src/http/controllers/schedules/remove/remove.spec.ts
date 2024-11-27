import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from 'utils/test/create-and-authenticate-user'

const defaultSchedule = {
  name: 'Name Test',
  about: 'About Test',
  slug: 'slug-test',
  logoUrl: 'https://www.test.com/logo-url-test.png',
  contact: {
    email: 'emailtest@test.com',
    phone: '99999999999',
  },
  address: {
    street: 'Street Test',
    number: 999,
    neighborhood: 'Neighborhood Test',
    city: 'City Test',
    state: 'State Test',
    zipCode: '99999999',
    complement: 'Complement Test',
  },
}

describe('Update Schedule (e2e)', () => {
  let token: string = ''

  beforeAll(async () => {
    await app.ready()

    const { token: tokenJwt } = await createAndAuthenticateUser(app)
    token = tokenJwt
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to remove', async () => {
    const responseScheduleCreated = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send(defaultSchedule)

    const response = await request(app.server)
      .delete(`/schedule/${responseScheduleCreated.body.schedule.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
  })

  it('should not be able to remove schedules of other users', async () => {
    const responseScheduleCreated = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send(defaultSchedule)

    const { token: AnotherUserToken } = await createAndAuthenticateUser(app, {
      name: 'Other Person',
      email: 'other-person@email.com',
    })

    const response = await request(app.server)
      .delete(`/schedule/${responseScheduleCreated.body.schedule.id}`)
      .set('Authorization', `Bearer ${AnotherUserToken}`)
      .send()

    expect(response.statusCode).toEqual(404)
  })
})
