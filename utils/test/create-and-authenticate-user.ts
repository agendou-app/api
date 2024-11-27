import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  user?: { name: string; email: string },
) {
  const userToCreate = {
    name: user?.name || 'John Doe',
    email: user?.email || 'johndoe@example.com',
    password: '123456',
  }

  await prisma.user.create({
    data: {
      name: userToCreate.name,
      email: userToCreate.email,
      password_hash: await hash(userToCreate.password, 6),
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: userToCreate.email,
    password: userToCreate.password,
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
