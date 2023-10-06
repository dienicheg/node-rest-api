const { Categoria, Usuario, Role, Producto } = require("../models");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol)
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
};

const emailYaExiste = async (correo = "") => {
  const usuario = await Usuario.findOne({ correo });
  if (usuario)
    throw new Error(`El email ${correo} ya existe en la base de datos`);
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) throw new Error(`No existe un usuario con el id ${id}`);
};

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findOne({_id: id});
  if (!existeCategoria)
    throw new Error(`No existe una categoria con el id ${id}`);
};

const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findOne({_id: id});
  if (!existeProducto)
    throw new Error(`No existe una producto con el id ${id}`);
};

//Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion)
  if(!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida, prueba con ${colecciones}`)
  }
  return true
}

module.exports = {
  esRoleValido,
  emailYaExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas
};
