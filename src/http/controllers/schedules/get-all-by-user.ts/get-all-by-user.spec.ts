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

describe('Get All User Schedules (e2e)', () => {
  let token: string = ''

  beforeAll(async () => {
    await app.ready()

    const { token: tokenJwt } = await createAndAuthenticateUser(app)
    token = tokenJwt
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get', async () => {
    await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'slug-01' })

    await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'slug-02' })

    await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'slug-03' })

    const response = await request(app.server)
      .get('/my-schedules')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('schedules')
    expect(Array.isArray(response.body.schedules)).toBe(true)
    expect(response.body.schedules).toHaveLength(3)
  })
})
