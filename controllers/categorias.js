const { response } = require("express");
const { Categoria } = require("../models");

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
  const { desde = 0, limite = 5 } = req.query;

  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    categorias,
  });
};

//obtenerCategoria - populate
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json({
    categoria,
  });
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const existeCategoria = await Categoria.findOne({ nombre });

  if (existeCategoria) {
    return res.status(400).json({
      msg: `La categoria ${existeCategoria.nombre} ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  await categoria.save();
  res.status(201).json({ categoria });
};

//actualizarCategoria - validar
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase()
  data.usuario = req.usuario._id

  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})
    res.json(categoria)
  } catch (error) {
    return res.json({
        msg: `Error: ${data.nombre} ya existe en la base de datos`
    })
  }

};

//eliminarCategoria - estado: false
const eliminarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, { new: true});

  res.json(categoriaBorrada);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
