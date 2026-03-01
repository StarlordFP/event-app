const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  const existing = await knex('users').where({ email: 'admin@eventapp.com' }).first();
  
  if (existing) {
    // Just make sure role and verified are correct
    await knex('users').where({ email: 'admin@eventapp.com' }).update({
      role: 'admin',
      is_verified: true,
    });
    return;
  }

  const password_hash = await bcrypt.hash('admin123', 12);
  await knex('users').insert({
    name: 'Admin',
    email: 'admin@eventapp.com',
    password_hash,
    role: 'admin',
    is_verified: true,
  });
};