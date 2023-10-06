const { response } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = async (req, res = response, next) => {

    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'   
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRET_JWT)

        //Leer usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)

        //Verificar que el usuario exista
        if(!usuario) {
            return res.status(404).json({
                msg: 'Token no valido - usuario no existe en la base de datos'
            })
        }


        //Verificar si el uid tiene estado true

        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }


        
        req.usuario = usuario
        next() 
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token no valido'   
        })
    }


}


module.exports = {
    validarJWT
}