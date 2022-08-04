import * as service from '../services/user.api.service.js'
import jwt from 'jsonwebtoken'

function create(req, res) {
    service.create(req.body)
    .then(() => res.status(201).json({
        message: 'Usuario creado'
    }))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}

function login(req, res) {
    service.login(req.body)
    .then( user => {
        const token = jwt.sign({id: user._id, name: user.name }, 'CLAVE_SECRETA')
        res.status(200).json({
            user,
            token
        })
    })
    .catch(err=> res.status(500).json({
        message: err.message
    }))
}

function findUserById (req, res) {
    service.findUserById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}


function findUserByEmail (req, res) {
    service.findUserByEmail(req.body.email)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}

function updateUser (req, res) {
    service.updateUser(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}

function forgotPassword (req, res) {
    service.forgotPassword(req.body)
    .then(user => res.status(200).json({
        message: 'Se ha enviado un correo con instrucciones para recuperar la contraseña'
    }))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}

function resetPassword (req, res) {
    service.resetPassword(req.body)
    .then(user => res.status(200).json({
        message: 'Contraseña actualizada'
    }))
    .catch(err => res.status(500).json({
        message: err.message
    }))
}


function updateImage (req, res) {
    const id = req.body.id
    const file = req.file
    service.updateImage(id, file)
    .then(function (user) {
        res.status(200).json(user)
      }).catch(function (err) {
        res.status(500).json({ error: err })
      })
}

function updateFile (req, res) {
    const id = req.body.id
    const file = req.file
    console.log(req)
    service.updateFile(id, file)
    .then(function (user) {
        res.status(200).json(user)
      })
    .catch(function (err) {
        res.status(500).json({ err })
    })
}




export {
    create,
    login,
    findUserById,
    findUserByEmail,
    updateUser,
    forgotPassword,
    resetPassword,
    updateImage,
    updateFile,

}