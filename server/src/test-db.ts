import db from './db/connection.js';   
async function test() {
  try {
    const users = await db('users').select('*');
    console.log('Users table exists. Current rows:', users);

    // Insert test user
    await db('users').insert({
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashedpassword123'
    });

    console.log('Test user inserted successfully');
  } catch (err) {
    console.error('DB test failed:', err);
  } finally {
    await db.destroy();
  }
}

test();