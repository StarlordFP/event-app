exports.up = function (knex) {
  return knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email', 255).notNullable().unique();
    t.string('password_hash', 255).notNullable();
    t.string('name', 255).notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
