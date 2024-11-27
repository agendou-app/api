import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { update } from './update'
import { getAllByUser } from './get-all-by-user.ts'

export async function schedulesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/schedules', create)
  app.put('/schedule', update)
  app.get('/my-schedules', getAllByUser)
}
