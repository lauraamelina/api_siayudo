import express from 'express'
import * as controller from '../controllers/user.api.controller.js'
import { authorization } from '../middlewares/auth.middlewares.js'
import uploadFile from '../middlewares/multer.js'

const route = express.Router()


route.post('/users/login', controller.login)
route.post('/users', controller.create)

route.post('/users/email', controller.findUserByEmail)
route.post('/users/forgotpassword', controller.forgotPassword)
route.patch('/users/resetpassword', controller.resetPassword)

route.get('/users/:id',[authorization], controller.findUserById)
route.put('/users/:id',[authorization], controller.updateUser)

route.post('/users/image', uploadFile(), controller.updateImage)
route.post('/users/file', uploadFile(), controller.updateFile)

export default route
