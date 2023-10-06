const mongoose = require('mongoose')


const dbConnection = async () => {

    try {
        
        await mongoose.connect(process.env.MONGODB_ATLAS)

        console.log('Conectado a la base de datos')
    } catch (error) {
        throw new Error(`Hubo un error al iniciar la base de datos ${error}`)
    }

}

module.exports = {
    dbConnection
}