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
    number: '999',
    neighborhood: 'Neighborhood Test',
    city: 'City Test',
    state: 'State Test',
    zipCode: '99999999',
  },
}

describe('Create Schedule (e2e)', () => {
  let token: string = ''

  beforeAll(async () => {
    await app.ready()

    const { token: tokenJwt } = await createAndAuthenticateUser(app)
    token = tokenJwt
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create', async () => {
    const response = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'should-be-able-to-create' })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to create with same slug', async () => {
    await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'same-slug' })

    const response = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'same-slug' })

    expect(response.statusCode).toEqual(409)
  })

  it('should not be able to create with invalid user', async () => {
    const invalidToken = 'invalidToken'

    const response = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ ...defaultSchedule, slug: 'invalid-user' })

    expect(response.statusCode).toEqual(401)
  })

  it('should be able to create with an already existing address', async () => {
    const firstResponse = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultSchedule, slug: 'existing-address-01' })

    const firstAddressId = firstResponse.body.schedule.addressId

    const secondResponse = await request(app.server)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...defaultSchedule,
        slug: 'existing-address-02',
        address: { ...defaultSchedule.address, id: firstAddressId },
      })

    const secondAddressId = secondResponse.body.schedule.addressId

    expect(secondResponse.statusCode).toEqual(201)
    expect(firstAddressId).toEqual(secondAddressId)
  })
})
