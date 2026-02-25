exports.up = function (knex) {
  return knex.schema.createTable('tags', (t) => {
    t.increments('id').primary();
    t.string('name', 100).notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tags');
};
