const http = require('http');

async function main() {
    const loginData = JSON.stringify({
        email: "jhonatanhtech@gmail.com",
        password: "Admin1327"
    });

    const token = await new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login', // Gateway routes /api/auth to Usuarios service
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(loginData)
            }
        }, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const data = JSON.parse(body);
                    resolve(data.token);
                } else {
                    reject('Login failed: ' + body);
                }
            });
        });
        req.on('error', reject);
        req.write(loginData);
        req.end();
    });

    console.log("Token Obtenido. Creando Pago...");

    const pagoData = JSON.stringify({
        pedidoId: 1,
        monto: 9399000
    });

    const reqPago = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/pagos/', 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(pagoData),
            'Authorization': 'Bearer ' + token
        }
    }, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log("Pago Response:", res.statusCode, body);
        });
    });

    reqPago.on('error', e => console.error(e));
    reqPago.write(pagoData);
    reqPago.end();
}

main().catch(console.error);
