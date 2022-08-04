import { database, ObjectId } from "./database.js";
import fs from 'fs'

const COLLECTION_NAME = 'post'

async function find () {
  return database(async db => {
    const posts = await db.collection(COLLECTION_NAME).find().toArray()
    return posts
  })
}


async function findOne (id) {
  return database(async db => {
      const post = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
      return post
  })

}

async function findByUser (id) {
  return database(async db => {
    const posts = await db.collection(COLLECTION_NAME).find({ 'creador._id': new ObjectId(id) }).toArray()
    return posts
  })
}

async function filterCategoria (id) {
  return database(async db => {
    const posts = await db.collection(COLLECTION_NAME).find({ 'categoria._id': new ObjectId(id) }).toArray()
    return posts
  })
}

async function addPost (request) {
  const post = {
    _id: new ObjectId(),
    creador: {
      nombre: request.creador.name,
      _id: new ObjectId(request.creador._id),
      type: request.creador.type
    },
    titulo: request.titulo,
    descripcion: request.descripcion,
    categoria: {
      nombre: request.categoria.nombre,
      _id: new ObjectId(request.categoria._id)
    },
    createdAt: new Date().toISOString()
}
    return database(async db => {
      const newPost = await db.collection(COLLECTION_NAME).insertOne(post)
      
      return post
    })
      
}

async function deletePost(id) {
  return database(async db => {
    const post = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return post
  })
}

async function updatePost (id, post) {
  const postEdit = {
    _id: new ObjectId(id),
    creador: {
      nombre: post.creador.name,
      _id: new ObjectId(post.creador._id),
      type: post.creador.type
    },
    titulo: post.titulo,
    descripcion: post.descripcion,
    categoria: {
      nombre: post.categoria.nombre,
      _id: new ObjectId(post.categoria._id)
    },
    createdAt: new Date().toISOString()
  }
  return database(async db => {
    const newPost = await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $set: postEdit })
    return newPost
  })
}

async function updatePostByUser (id) {
  return database(async db => {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) })
    const posts = await db.collection(COLLECTION_NAME).updateMany({ 'creador._id': new ObjectId(id) }, {$set: { 'creador.nombre': user.name } })
    return posts
  })
}

async function uploadFile (id, file) {
  return database(async db => {
    const contents = fs.readFileSync(file.path, {encoding: 'base64'});
    const post = await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, {$set: {image: contents} })
    return post
  })
}



export {
  find,
  findOne,
  findByUser,
  filterCategoria,
  addPost,
  deletePost,
  updatePost,
  updatePostByUser,
  uploadFile
}
