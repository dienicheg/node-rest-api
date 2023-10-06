const { check } = require("express-validator");
const { Router } = require("express");

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete 
} = require("../controllers/usuarios");

const { 
    esRoleValido, 
    emailYaExiste, 
    existeUsuarioPorId 
} = require("../helpers/db-validators");


const {
    validarCampos, 
    esAdminRole, 
    tieneRole, 
    validarJWT 
} = require('../middlewares')

const router = Router();

router.get("/", usuariosGet);

router.post("/", [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener al menos 8 caracteres').isLength({min: 8}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailYaExiste ),
    //check('rol', 'No es rol permitido').isIn(["ADMIN_ROLE","USER_ROLE"]),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.put("/:id",[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.delete("/:id", [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],
usuariosDelete);

module.exports = router;
