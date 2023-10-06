const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {

  const { desde = 0, limite = 5 } = req.query;

  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    total,
    productos
  });
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id).populate("usuario", "nombre").populate('categoria','nombre')

  res.json({
    producto,
  });
};

const crearProducto = async (req, res = response) => {

  const { estado, usuario, ...body } = req.body
    
  const nombre = req.body.nombre.toUpperCase()

  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    ...body,
    nombre,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  await producto.save();
  res.status(201).json({ producto });
};

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase()
  data.usuario = req.usuario._id

  try {
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
    res.json(producto)
  } catch (error) {
    return res.json({
        msg: `Error: ${data.nombre} ya existe en la base de datos`
    })
  }

};

const eliminarProducto = async (req, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, { new: true});

  res.json(productoBorrado);
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
