import express from 'express'
import * as controller from '../controllers/admin.api.controller.js'
import { authorization } from '../middlewares/auth.middlewares.js'

const route = express.Router()

route.all('/api/admin', authorization)

route.get('/api/admin/users', controller.getAllUsers) 
route.patch('/api/admin/users/verificacion', controller.verificarUser)
route.put('/api/admin/users', controller.updateUser)
route.get('/api/admin/categorias', controller.getCategoriasFromPosts)
route.get('/api/admin/posts', controller.getPostsByTypeUser)
route.get('/api/admin/:id/motivo', controller.findMotivo)
route.post('/api/admin/user/accept', controller.acceptUser)
route.post('/api/admin/user/reject', controller.rejectUser)


export default route
