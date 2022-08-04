import express from 'express'
import postController from '../controllers/post.api.controller.js'
import {authorization} from '../middlewares/auth.middlewares.js'
import uploadFile from '../middlewares/multer.js'
const route = express.Router()


route.all('/api/posts', authorization)


route.get('/api/posts', postController.getAll) 
route.get('/api/posts/:id', postController.viewOne)
route.get('/api/user/:id/posts', postController.findByUser)
route.put('/api/user/:id/posts', postController.updatePostByUser)
route.get('/api/posts/categoria/:categoria', postController.filterCategoria) 


route.post('/api/posts', postController.addPost)
route.put('/api/posts/:id', postController.updatePost)
route.delete('/api/posts/:id', postController.deletePost)

route.post('/api/posts/upload', uploadFile(), postController.uploadFile)
export default route
