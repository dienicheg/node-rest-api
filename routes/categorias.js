const { check } = require("express-validator");
const { Router } = require("express");
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const router = Router();


//Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//Obtener una categoria por id - publico
router.get("/:id", [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);

//Crear una nueva categoria - privado - cualquier persona con token valido
router.post("/",[
    validarJWT,
    check('nombre', 'El nombre  de la categoria es obligatoria').not().isEmpty(),
    validarCampos
] , crearCategoria);

//Actualizar - privado - cualquier persona con token valido
router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],actualizarCategoria);

//Borrar - privado - Admin
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], eliminarCategoria);


module.exports = router
