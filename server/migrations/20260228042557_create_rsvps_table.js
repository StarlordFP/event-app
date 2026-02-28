/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('rsvps', function (table) {
    table.increments('id').primary();
    table.integer('event_id').unsigned().notNullable()
      .references('id').inTable('events').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.enum('status', ['yes', 'no', 'maybe']).notNullable();
    table.timestamps(true, true);
    // One RSVP per user per event
    table.unique(['event_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('rsvps');
};