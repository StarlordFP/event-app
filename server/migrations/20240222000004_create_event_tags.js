exports.up = function (knex) {
  return knex.schema.createTable('event_tags', (t) => {
    t.increments('id').primary();
    t.integer('event_id').unsigned().notNullable();
    t.integer('tag_id').unsigned().notNullable();
    t.foreign('event_id').references('events.id').onDelete('CASCADE');
    t.foreign('tag_id').references('tags.id').onDelete('CASCADE');
    t.unique(['event_id', 'tag_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('event_tags');
};
