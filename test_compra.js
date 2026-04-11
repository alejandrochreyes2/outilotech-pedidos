const http = require('http');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log("Cargando test de compra...");
    await delay(3000); // Darle tiempo a los contenedores
    
    const checkoutData = JSON.stringify({
      Cliente: "OutilTech Test",
      Total: 9399000.00,
      Email: "test@outiltech.co",
      Telefono: "3110000000",
      Nombre: "Usuario",
      Apellido: "Prueba",
      Empresa: "OutilTech Demo",
      Ciudad: "Bogotá",
      Direccion: "Calle Test 123",
      Barrio: "Centro",
      TipoId: "CC",
      NumeroId: "999999999",
      MetodoEnvio: "domicilio",
      MetodoPago: "tarjeta",
      ItemsJson: "[{\"id\":3,\"nombre\":\"MacBook Pro 14 M5\",\"cantidad\":1,\"v_unitario\":9399000}]"
    });

    const reqCheckout = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/pedidos/checkout',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(checkoutData)
        }
    }, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log("Checkout Response:", res.statusCode, body);
        });
    });

    reqCheckout.on('error', e => console.error("Checkout Error: ", e));
    reqCheckout.write(checkoutData);
    reqCheckout.end();
}

main();
