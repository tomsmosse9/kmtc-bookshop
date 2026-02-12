const http = require('http');

const data = JSON.stringify({
    studentId: 'TEST001',
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', body);
        if (res.statusCode === 200) {
            console.log('SUCCESS: Login API verified successfully.');
        } else {
            console.log('FAILURE: Login API failed with status', res.statusCode);
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
    process.exit(1);
});

req.write(data);
req.end();
