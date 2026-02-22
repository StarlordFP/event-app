import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('event_tags', (table) => {
    table.bigInteger('event_id').unsigned().notNullable();
    table.bigInteger('tag_id').unsigned().notNullable();

    table.primary(['event_id', 'tag_id']);

    table
      .foreign('event_id')
      .references('events.id')
      .onDelete('CASCADE');

    table
      .foreign('tag_id')
      .references('tags.id')
      .onDelete('CASCADE');

    // Speeds up "find all events with this tag"
    table.index('tag_id');
  });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('event_tags');
}

