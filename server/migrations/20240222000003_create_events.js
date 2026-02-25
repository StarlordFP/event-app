exports.up = function (knex) {
  return knex.schema.createTable('events', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable();
    t.foreign('user_id').references('users.id').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.text('description');
    t.dateTime('event_date').notNullable();
    t.string('location', 500);
    t.enum('event_type', ['public', 'private']).notNullable().defaultTo('public');
    t.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('events');
};
