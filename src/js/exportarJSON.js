// Función para crear archivo JSON
const path = require("path");
const fs = require("fs");

/**
 * Exporta un arreglo a un archivo Excel (.xlsx)
 * @param {Array<Object>} datos - Arreglo de productos u objetos.
 * @param {string} nombreArchivo - Nombre del archivo a guardar (ej: "resultados.xlsx")
 * @param {string} carpetaDestino - Carpeta donde guardar el archivo (ej: "./archivosGenerados")
 */


function exportDatosAJson(datos, nombreArchivo = "resultados.json", carpetaDestino = "./archivosGenerados") {
    if (!Array.isArray(datos) || datos.length === 0) {
        console.log("No hay datos para exportar.");
        return;
    }

    // Asegurarse de que la carpeta exista
    if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true });
    }
    // Crear ruta completa al archivo
    const rutaCompleta = path.join(carpetaDestino, nombreArchivo);
    

    console.log(`::: Creando el archivo ${nombreArchivo} .... :::`);

    let datosParseados = JSON.stringify(datos);
    fs.writeFileSync(rutaCompleta, datosParseados);

    console.log(`::: ${nombreArchivo} TERMINADO 🚀 ubicalo en ${rutaCompleta}:::`);
}

module.exports = exportDatosAJson;