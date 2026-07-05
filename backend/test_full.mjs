import http from 'http';

const request = (method, path, body, token) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    const req = http.request(opts, r => {
      let s = '';
      r.on('data', c => s += c);
      r.on('end', () => resolve({ status: r.statusCode, body: JSON.parse(s) }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log('\n========= EcoWaste API Health Check =========\n');

  // 1. Signup new user
  console.log('--- Test 1: Signup ---');
  const signupRes = await request('POST', '/api/auth/signup', {
    name: 'Test Resident',
    email: `test_${Date.now()}@eco.com`,
    password: 'test1234',
    role: 'citizen'
  });
  console.log(`Signup: ${signupRes.status === 201 ? 'PASS ✓' : 'FAIL ✗'} (status ${signupRes.status})`);
  const citizenToken = signupRes.body.token;

  // 2. Login as admin
  console.log('\n--- Test 2: Admin Login ---');
  const loginRes = await request('POST', '/api/auth/login', { email: 'admin@waste.com', password: 'admin123' });
  const adminToken = loginRes.body.token;
  console.log(`Admin Login: ${loginRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'} (role: ${loginRes.body.user?.role})`);

  // 3. Login as staff
  console.log('\n--- Test 3: Staff Login ---');
  const staffLogin = await request('POST', '/api/auth/login', { email: 'staff@waste.com', password: 'staff123' });
  const staffToken = staffLogin.body.token;
  console.log(`Staff Login: ${staffLogin.status === 200 ? 'PASS ✓' : 'FAIL ✗'} (role: ${staffLogin.body.user?.role})`);

  // 4. Fetch notifications
  console.log('\n--- Test 4: Notifications ---');
  const notifRes = await request('GET', '/api/notifications');
  console.log(`Notifications: ${notifRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'} (${notifRes.body.length} items)`);

  // 5. Staff logs collection
  console.log('\n--- Test 5: Log Collection (Staff) ---');
  const colRes = await request('POST', '/api/collections', {
    ward_no: 'Ward 3',
    waste_type: 'dry',
    weight_kg: 75.2,
    segregated_correctly: 1,
    notes: 'Automated API test collection entry'
  }, staffToken);
  console.log(`Log Collection: ${colRes.status === 201 ? 'PASS ✓' : 'FAIL ✗'} (status ${colRes.status})`);

  // 6. Fetch collections
  console.log('\n--- Test 6: Fetch Collections ---');
  const colListRes = await request('GET', '/api/collections', null, staffToken);
  console.log(`Fetch Collections: ${colListRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'} (${colListRes.body.length} records)`);

  // 7. Citizen files an issue
  console.log('\n--- Test 7: File Citizen Issue ---');
  const issueRes = await request('POST', '/api/issues', {
    title: 'API Test Complaint',
    description: 'Automated test issue from test script.'
  }, citizenToken);
  console.log(`File Issue: ${issueRes.status === 201 ? 'PASS ✓' : 'FAIL ✗'} (status ${issueRes.status})`);
  const issueId = issueRes.body.issueId;

  // 8. Admin views issues
  console.log('\n--- Test 8: Admin Fetches All Issues ---');
  const issuesRes = await request('GET', '/api/issues', null, adminToken);
  console.log(`Fetch Issues: ${issuesRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'} (${issuesRes.body.length} tickets)`);

  // 9. Admin resolves issue
  console.log('\n--- Test 9: Admin Resolves Issue ---');
  const resolveRes = await request('PUT', `/api/issues/${issueId}`, { status: 'resolved' }, adminToken);
  console.log(`Resolve Issue: ${resolveRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'} (${resolveRes.body.message})`);

  // 10. Admin dashboard stats
  console.log('\n--- Test 10: Admin Dashboard Stats ---');
  const statsRes = await request('GET', '/api/dashboard/stats', null, adminToken);
  console.log(`Dashboard Stats: ${statsRes.status === 200 ? 'PASS ✓' : 'FAIL ✗'}`);
  if (statsRes.status === 200) {
    console.log(`  ➤ Compliance Rate: ${statsRes.body.complianceRate}%`);
    console.log(`  ➤ Pending Issues: ${statsRes.body.pendingIssuesCount}`);
    console.log(`  ➤ Category Stats: ${statsRes.body.categoryStats.map(c => `${c.waste_type}=${c.total_weight}kg`).join(', ')}`);
    console.log(`  ➤ Ward Stats: ${statsRes.body.wardStats.map(w => `${w.ward_no}(${w.compliance_percentage}%)`).join(', ')}`);
  }

  console.log('\n========= All Tests Complete =========\n');
}

runTests().catch(console.error);
