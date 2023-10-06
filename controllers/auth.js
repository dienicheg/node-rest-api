const {response} = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require("../models/usuario")
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')


const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {
        //Verificar si el email existe
            const usuario = await Usuario.findOne({ correo })
            if( !usuario ) {
                return res.status(400).json({
                    msg: "Usuario / Password no son correctos - Correo"
                })
            }

        //El usuario esta activo
            if(!usuario.estado) {
                return res.status(400).json({
                    msg: 'Usuario / Password no son correctos - estado: false'
                })
            }
            
        //Verificar password
            const validPassword = bcryptjs.compareSync(password, usuario.password)
            if(!validPassword) {
                return res.status(400).json({
                    msg: 'Usuario / Password no son correctos - Contraseña incorrecta'
                })
            }

        //Generar JWT
            const token = await generarJWT(usuario.id)

            
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status.json({
            msg: 'Hubo un error, hable con el administrador'
        })
    }
    

}

const googleSignIn = async (req, res = response) => {
    
    const {id_token} = req.body
    try {
        const { correo, nombre, img } = await googleVerify(id_token)

        //Verificar si existe un usuario con el correo ingresado

        let usuario = await Usuario.findOne({correo})
        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario( data )
            console.log(usuario)
            await usuario.save()
        }

        //Si el usuario en DB
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error
        })
    }
    
}



module.exports = {
    login,
    googleSignIn
}