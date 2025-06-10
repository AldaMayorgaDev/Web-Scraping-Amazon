// Función para crear archivo csv


const {Parser} = require('json2csv');
const path = require("path");
const fs = require("fs");

/**
 * Exporta un arreglo a un archivo CSV (.csv)
 * @param {Array<Object>} datos - Arreglo de productos u objetos.
 * @param {string} nombreArchivo - Nombre del archivo a guardar (ej: "resultados.csv")
 * @param {string} carpetaDestino - Carpeta donde guardar el archivo (ej: "./archivosGenerados")
 * @param {Array<string>} fields - Arreglo de campos / columnas .
 */

function exportarDatosACsv (datos, nombreArchivo = "resultados.csv", carpetaDestino = "./archivosGenerados", fields=[]){

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

    const json2csvParse = new Parser (
        {
            fields: fields,
            defaultValue: "No info"
        }
    )
    const csv =json2csvParse.parse(datos);
    fs.writeFileSync(rutaCompleta, csv, "utf-8");


    console.log(`::: ${nombreArchivo} TERMINADO 🚀 ubicalo en ${rutaCompleta}:::`);
}
module.exports = exportarDatosACsv;