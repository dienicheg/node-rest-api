const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario.js");

const usuariosGet = async (req = request, res = response) => {
  const {desde = 0, limite = 5} = req.query

  const query = {estado: true}

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite))
  ])
  
  res.status(200).json({
    total, 
    usuarios
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;

  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar password
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en base de datos
  await usuario.save();

  res.status(200).json({
    msg: "post API - Controlador",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;

  const {_id, password, google, correo, ...resto } = req.body
  
  //TODO: validar contra base de datos
  
  if(password) {
    //Encriptar password
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto)

  res.status(200).json({
    msg: "put API - Controlador",
    usuario
  });
};

const usuariosDelete = async (req, res = response) => {
   
  const {id} = req.params

  const usuario = await Usuario.findByIdAndUpdate( id, {estado: false} )
  res.status(200).json({
    usuario
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
