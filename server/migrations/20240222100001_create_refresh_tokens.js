exports.up = function (knex) {
  return knex.schema.createTable('refresh_tokens', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable();
    t.foreign('user_id').references('users.id').onDelete('CASCADE');
    t.string('token_hash', 255).notNullable().unique();
    t.dateTime('expires_at').notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
