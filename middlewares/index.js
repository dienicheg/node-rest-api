const validaJWT = require("../middlewares/validar-jwt");
const validaRoles = require('../middlewares/validar-roles')
const validaCampos = require("../middlewares/validar-campos");
const validarArchivoSubir = require("../middlewares/validar-archivo");


module.exports = {
    ...validaJWT,
    ...validaRoles,
    ...validaCampos,
    ...validarArchivoSubir
}