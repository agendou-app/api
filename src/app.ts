import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

import i18n from 'fastify-i18n'
import { errorMessages } from '@/dictionaries/errors'

import { ZodError } from 'zod'
import { env } from './env'

import { usersRoutes } from '@/http/controllers/users/routes'

import { ResourceNotFoundError } from '@/errors/resource-not-found'

export const app = fastify()

app.register(i18n, {
  fallbackLocale: 'en',
  messages: errorMessages,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1d',
  },
})

app.register(usersRoutes)

app.setErrorHandler((error, req, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: req.i18n.t('resource_not_found'),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
