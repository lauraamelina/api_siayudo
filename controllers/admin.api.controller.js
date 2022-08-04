import * as AdminService from '../services/admin.api.service.js';

function getAllUsers (req, res) {
    AdminService.getAllUsers()
      .then(function (users) {
        res.status(200).json(users)
      }).catch(function (err) {
        res.status(500).json({ err: 'Error de conexión de base de datos' })
      })
  }

  function verificarUser (req, res) {
    const id = req.body.id
    const status = req.body.status
    const motivo = req.body.motivo

    AdminService.verificarUser(id, status, motivo)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}

function updateUser (req, res) {
    const user = req.body
    AdminService.updateUser(user)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}

  function getCategoriasFromPosts (req, res) {
    AdminService.getCategoriasFromPosts()
    .then(categorias => res.status(200).json(categorias))
    .catch(err => res.status(500).json({
        message: err.message
    }))
  }

  function findMotivo (req, res) {
    const id = req.params.id
    AdminService.findMotivo(id)
    .then(motivo => res.status(200).json(motivo))
    .catch(err => res.status(500).json({
        message: err.message
    }))
  }

  function getPostsByTypeUser (req, res) {
    AdminService.getPostsByTypeUser()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({
        message: err.message
    }))
  }

  function acceptUser (req, res) {
    const email = req.body.email
    AdminService.acceptUser(email)
    .then(() => res.status(200).json({message: 'Usuario aceptado'}))
    .catch(err => res.status(500).json({
        message: err.message
    }))
  }

  function rejectUser (req, res) {
    const email = req.body.email
    AdminService.rejectUser(email)
    .then(() => res.status(200).json({message: 'Usuario rechazado'}))
    .catch(err => res.status(500).json({
        message: err.message
    }))
  }

  export {
    getAllUsers,
    verificarUser,
    updateUser,
    getCategoriasFromPosts,
    findMotivo,
    getPostsByTypeUser,
    acceptUser,
    rejectUser
    
  }