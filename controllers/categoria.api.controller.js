import * as CategoriaModel from '../services/categoria.api.service.js';

function getAll (req, res) {
    CategoriaModel.find()
      .then(function (categorias) {
        res.status(200).json(categorias)
      }).catch(function (err) {
        res.status(500).json({ err: 'Error de conexión de base de datos' })
      })
  }

  export default {
    getAll,
  }