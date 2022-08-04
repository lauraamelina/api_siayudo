import express from 'express'
import categoriaController from '../controllers/categoria.api.controller.js'
import { authorization } from '../middlewares/auth.middlewares.js'

const route = express.Router()

route.all('/api/categorias', authorization)

route.get('/api/categorias', categoriaController.getAll) 

export default route
