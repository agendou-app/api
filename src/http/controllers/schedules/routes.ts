import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { update } from './update'

export async function schedulesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/schedules', create)
  app.put('/schedule', update)
}
