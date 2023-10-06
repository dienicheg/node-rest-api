const {v4: uuidv4} = require('uuid')
const path = require('path')

const subirArchivo = ( files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = '') => {

  return new Promise((resolve, reject) => {

    const { archivo } = files;

    if(!archivo) {
      return reject(`No se envió ningun archivo`)
    }

    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    //Validar la extension
    if (!extensionesValidas.includes(extension)) {
        return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`)
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err)
      }

      resolve(nombreTemp)
    });
  });
};

module.exports = {
  subirArchivo,
};
