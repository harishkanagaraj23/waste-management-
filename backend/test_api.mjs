import http from 'http';

const testLogin = (email, password, label) => {
  const data = JSON.stringify({ email, password });
  const opts = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  };
  const req = http.request(opts, r => {
    let s = '';
    r.on('data', c => s += c);
    r.on('end', () => {
      const parsed = JSON.parse(s);
      console.log(`[${label}] Status: ${r.statusCode} | Role: ${parsed.user?.role || 'N/A'} | Token: ${parsed.token ? 'OK' : 'MISSING'}`);
    });
  });
  req.on('error', e => console.error(`[${label}] Error: ${e.message}`));
  req.write(data);
  req.end();
};

// Test all 3 accounts
testLogin('admin@waste.com', 'admin123', 'ADMIN');
setTimeout(() => testLogin('staff@waste.com', 'staff123', 'STAFF'), 300);
setTimeout(() => testLogin('citizen@waste.com', 'citizen123', 'CITIZEN'), 600);
setTimeout(() => testLogin('bad@email.com', 'wrongpass', 'INVALID (expected error)'), 900);
