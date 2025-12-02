const axios = require('axios');
const cheerio = require('cheerio');

// URL de la página a scrapear
const URL = 'https://www.xe.com/es/currencyconverter/convert/?Amount=1&From=GBP&To=MXN';

async function obtenerCotizacion() {
  try {
    console.log('🌐 Descargando página...');
    console.log(`URL: ${URL}\n`);

    // Hacer la petición HTTP para obtener el HTML
    const response = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('✅ Página descargada exitosamente');
    console.log(`📄 Tamaño del HTML: ${response.data.length} caracteres\n`);

    // Guardar el HTML completo (opcional, para debug)
    const fs = require('fs');
    fs.writeFileSync('pagina.html', response.data);
    console.log('💾 HTML guardado en: pagina.html\n');

    // Cargar el HTML en cheerio (similar a jQuery)
    const $ = cheerio.load(response.data);

    console.log('🔍 Buscando la cotización en el HTML...\n');

    // Estrategia 1: Buscar por clase específica
    const cotizacion1 = $('.unit-rates__list-item-value').first().text().trim();
    
    // Estrategia 2: Buscar en elementos con data attributes
    const cotizacion2 = $('[data-testid="conversion-result"]').text().trim();
    
    // Estrategia 3: Buscar por patrones de texto
    let cotizacionPatron = '';
    $('*').each((i, elem) => {
      const texto = $(elem).text();
      // Buscar patrón: número con decimales seguido de MXN o "pesos mexicanos"
      const match = texto.match(/(\d{2}\.\d{4})\s*(MXN|Pesos mexicanos)/i);
      if (match && !cotizacionPatron) {
        cotizacionPatron = match[1];
      }
    });

    // Estrategia 4: Buscar en todo el texto
    const textoCompleto = $.text();
    const matchCompleto = textoCompleto.match(/1\s*GBP\s*=\s*([\d.,]+)\s*MXN/i);

    console.log('📊 RESULTADOS DE LA BÚSQUEDA:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Estrategia 1 (por clase): ${cotizacion1 || 'No encontrado'}`);
    console.log(`Estrategia 2 (data-testid): ${cotizacion2 || 'No encontrado'}`);
    console.log(`Estrategia 3 (patrón): ${cotizacionPatron || 'No encontrado'}`);
    console.log(`Estrategia 4 (texto completo): ${matchCompleto ? matchCompleto[1] : 'No encontrado'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Mostrar fragmentos relevantes del HTML
    console.log('📝 FRAGMENTOS DE HTML RELEVANTES:\n');
    
    // Buscar elementos que contengan "GBP" y "MXN"
    $('*').each((i, elem) => {
      const texto = $(elem).text();
      if (texto.includes('GBP') && texto.includes('MXN') && texto.length < 100) {
        const html = $.html(elem);
        if (html.length < 200) {
          console.log(`Elemento ${i}:`);
          console.log(html.substring(0, 150));
          console.log('---\n');
        }
      }
    });

    // Mostrar ejemplo de cómo buscar texto específico
    console.log('\n🔎 EJEMPLO DE BÚSQUEDA DE TEXTO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Buscar todos los números que parecen cotizaciones
    const numeros = textoCompleto.match(/\d{2}\.\d{2,4}/g);
    if (numeros) {
      console.log('Números encontrados que podrían ser la cotización:');
      numeros.slice(1, 2).forEach(num => {
        console.log(`  → ${num}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`Código de estado: ${error.response.status}`);
    }
  }
}

// Ejecutar la función
console.log('╔════════════════════════════════════════════╗');
console.log('║  SCRAPER DE COTIZACIÓN GBP/MXN            ║');
console.log('║  Libra Esterlina a Peso Mexicano          ║');
console.log('╚════════════════════════════════════════════╝\n');

obtenerCotizacion();