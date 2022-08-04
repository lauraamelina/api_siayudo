import * as PostModel from '../services/post.api.service.js'

function getAll (req, res) {
  PostModel.find()
    .then(function (posts) {
      res.status(200).json(posts)
    }).catch(function () {
      res.status(500).json({ err: 'Error de conexión de base de datos' })
    })
}


function viewOne (req, res) {
  const id  = req.params.id
  PostModel.findOne(id)
    .then(function (post) {
        res.status(200).json(post)
    }).catch(function (err) {
        res.status(500).json({ err})
    })  

}

function findByUser (req, res) {
  const id = req.params.id
  PostModel.findByUser(id)
    .then(function (posts) {
      res.status(200).json(posts)
    }).catch(function (err) {
      res.status(500).json({ err: 'Error de conexión de base de datos' })
    })
}

function filterCategoria (req, res) {
  const categoria = req.params.categoria
  PostModel.filterCategoria(categoria)
    .then(function (posts) {
      res.status(200).json(posts)
    }).catch(function (err) {
      res.status(500).json({ err: 'Error de conexión de base de datos' })
    })
}


function addPost (req, res) {
  const postNuevo = req.body
  PostModel.addPost(postNuevo)
    .then(function (post) {
        res.status(201).json(post)
    }).catch(function (err) {
      res.status(500).json({ err: err })
    })
}

function deletePost(req, res) {
  const id = req.params.id
  PostModel.deletePost(id)
    .then(function (posts) {
      res.status(200).json(posts)
    }).catch(function (err) {
      res.status(500).json({ err: 'Error de conexión de base de datos' })
    })
      
}

function updatePost (req, res) {
  const id = req.params.id
  const post = req.body
  PostModel.updatePost(id, post)
    .then(function (post) {
        res.status(200).json(post)
    }).catch(function (err) {
      res.status(500).json({ err: 'Error de conexión de base de datos' })
    })
}

function updatePostByUser (req, res) {
  const id = req.params.id
  PostModel.updatePostByUser(id)
    .then(function (post) {
        res.status(200).json(post)
    }).catch(function (err) {
      res.status(500).json({ err: 'Error de conexión de base de datos' })
    })
}

function uploadFile (req, res) {
  const id = req.body.id
  const file = req.file
  PostModel.uploadFile(id, file)
    .then(function (post) {
      res.status(200).json(post)
    }).catch(function (err) {
      res.status(500).json({ error: err })
    })
}


export default {
  getAll,
  filterCategoria,
  addPost,
  deletePost,
  viewOne,
  findByUser,
  updatePost,
  updatePostByUser,
  uploadFile
}
