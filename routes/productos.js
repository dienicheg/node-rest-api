const { Router } = require("express");
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { existeCategoriaPorId, existeProductoPorId } = require("../helpers/db-validators");



const router = Router();

router.get("/", obtenerProductos);

//Obtener una producto por id - publico
router.get("/:id", [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);


router.post("/",[
    validarJWT,
    check('categoria', 'categoria no puede ir vacio').not().isEmpty(),
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);

router.put("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos
], actualizarProducto);

router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], eliminarProducto);







module.exports = router