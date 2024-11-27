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

const editedScheduleBase = {
  name: 'Name Edited',
  about: 'About Edited',
  logoUrl: 'https://www.edited.com/logo-url-edited.png',
  contact: {
    email: 'emailedited@edited.com',
    phone: '11111111111',
  },
  address: {
    street: 'Street Edited',
    number: 111,
    neighborhood: 'Neighborhood Edited',
    city: 'City Edited',
    state: 'State Edited',
    zipCode: '11111111',
    complement: 'Complement Edited',
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

  it('should be able to update', async () => {
    const responseCreated = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send(defaultSchedule)

    const scheduleCreated = responseCreated.body.schedule

    const editedSchedule = {
      ...editedScheduleBase,
      id: scheduleCreated.id,
      slug: 'edited-slug',
      address: {
        ...editedScheduleBase.address,
        id: scheduleCreated.addressId,
      },
    }

    const response = await request(app.server)
      .put('/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send(editedSchedule)

    console.log(response.body.schedule)

    expect(response.statusCode).toEqual(200)
    expect(response.body.schedule).toMatchObject(editedSchedule)
  })
})
