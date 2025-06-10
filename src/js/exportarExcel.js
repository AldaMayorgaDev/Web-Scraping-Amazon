// Función para crear archivo de excel

const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

/**
 * Exporta un arreglo a un archivo Excel (.xlsx)
 * @param {Array<Object>} datos - Arreglo de productos u objetos.
 * @param {string} nombreArchivo - Nombre del archivo a guardar (ej: "resultados.xlsx")
 * @param {string} carpetaDestino - Carpeta donde guardar el archivo (ej: "./archivosGenerados")
 */
function exportarDatosAExcel(datos, nombreArchivo = "resultados.xlsx", carpetaDestino = "./archivosGenerados", nombreHoja="resultados") {
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

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
    XLSX.writeFile(workbook, rutaCompleta);

    console.log(`::: ${nombreArchivo} TERMINADO 🚀 ubicalo en ${rutaCompleta}:::`);
}

module.exports = exportarDatosAExcel;
