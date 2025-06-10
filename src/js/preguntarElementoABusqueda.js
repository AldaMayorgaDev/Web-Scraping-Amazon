// Importamos el módulo 'readline' nativo de Node.js.
// Este módulo permite leer entradas del usuario desde la consola.
const readline = require('readline');

// Esta función devolverá una Promesa que se resuelve cuando el usuario introduce un texto.
function preguntarElemento() {
    return new Promise((resolve) => {

        // Creamos una interfaz de lectura con readline.
        // - 'input: process.stdin' -> lee desde la consola.
        // - 'output: process.stdout' -> muestra texto en la consola.
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Función auxiliar para hacer la pregunta de forma recursiva si la entrada es inválida
        function hacerPregunta() {
            rl.question("¿Qué producto deseas buscar en Amazon? 🔍 ", (respuesta) => {
                const argumentoBusqueda = respuesta.trim(); // elimina espacios al inicio y al final

                if (argumentoBusqueda === '' || argumentoBusqueda.length < 3) {
                    console.log("❌ Entrada inválida. No puede estar vacía o contener solo espacios.\n");
                    hacerPregunta(); // vuelve a preguntar
                } else {
                    rl.close();
                    resolve(argumentoBusqueda); // enviamos la respuesta ya limpia (sin espacios)
                }
            });
        }

        hacerPregunta(); // primera llamada
    });
}

module.exports = preguntarElemento;