const puppeteer = require('puppeteer');
const preguntarElemento = require('./src/js/preguntarElementoABusqueda.js');
const exportarDatosAExcel = require('./src/js/exportarExcel.js');
const exportarDatosACsv = require('./src/js/exportarCsv.js');
const exportDatosAJson = require('./src/js/exportarJSON.js');

(async ()=>{
    const elementoABuscar = await preguntarElemento(); // 🟡 Se pide al usuario
    const URL = `https://www.amazon.com.mx/s?k=${encodeURIComponent(elementoABuscar)}`;

    console.log(`:::  ⏳ Iniciando búsqueda para scrapear ${elementoABuscar} ::::`);
    const navegador = await puppeteer.launch({
        headless: false,
        slowMo: 450
    })

    const pagina = await navegador.newPage();

    await pagina.goto(URL, {waitUntil: 'networkidle2'});

    //Extraer información
    console.log('|**** Extrayendo información  🗃️ ****|')
    const titulo = await pagina.title();
    console.log("🚀 ~ titulo:", titulo)
    
    let productos = [];
    let btnSiguientePaginaActivo = true;
    
    while (btnSiguientePaginaActivo) {
        const productosObtenidos = await pagina.evaluate(()=>{

            const resultados = Array.from(
                document.querySelectorAll('.puis-card-container.s-card-container')
            )

            return resultados.map((producto)=>{
                const titulo = producto.querySelector('h2.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal>span')?.innerText;
                const precioEntero = producto.querySelector('span.a-price-whole')?.innerText;
                const precioDecimal = producto.querySelector('span.a-price-fraction')?.innerText;
                const precioLista = producto.querySelector('span.a-price.a-text-price > span.a-offscreen')?.innerText;
                const imagenProducto = producto.querySelector('img.s-image')?.currentSrc;
                
                //Validación campos vacios
                if(!precioEntero || !precioDecimal || !precioLista || !imagenProducto){
                    return {
                        titulo,
                        precio : 'N/A',
                        precioLista: 'N/A',
                        imagenProducto : 'No disponible'
                    }
                }

                // Limpieza de datos
                
                const precioEnteroLimpio = precioEntero.replace(/\n/g, "").trim();
                const precioDecimalLimpio = precioDecimal.replace(/\n/g, "").trim();
                const precioListaLimpio = precioLista.replace(/\n/g, "").trim();
                //Retorno de Datos
                return {
                    titulo,
                    precio : `${precioEnteroLimpio}${precioDecimalLimpio}`,
                    precioLista :  precioListaLimpio,
                    imagenProducto  
                }
            })
        });

        //Agregar datos a arreglo productos
        productos = [...productos, ...productosObtenidos];
        

        //Avanzar Siguiente Pagina
        btnSiguientePaginaActivo = await pagina.evaluate(()=>{
            const btnSiguiente = document.querySelector('.s-pagination-next');

            if(btnSiguiente && !btnSiguiente.classList.contains('s-pagination-disabled')){
                btnSiguiente.click();
                return true;
            }else{
                return false;
            }
        });

        //Esperar a que se de click
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        
    }

    console.log('::: Todos los productos Scrapeados :::', productos);


    navegador.close();

    console.log(`:::  ⌛️ Terminando proceso. ::::`);




    //Exportar Datos a diferentes formatos

    console.log(`:::  Inicia proceso de creación de archivos 🗂️ ::::`);

    exportarDatosAExcel(productos, "resultadosAmazon.xlsx", "./output", "datos obtenidos");
    exportarDatosACsv(productos, "resultadosAmazon.csv", "./output", ['titulo', 'precio', 'precioLista', 'imagenProducto']);
    exportDatosAJson(productos,"resultadosAmazon.json", "./output" );
})();

