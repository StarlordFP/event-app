import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('events', (table) => {
    table.bigIncrements('id').primary();
    
    table.bigInteger('creator_id').unsigned().notNullable();
    table.foreign('creator_id').references('users.id').onDelete('CASCADE');

    table.string('title', 200).notNullable();
    table.text('description').nullable();
    table.dateTime('start_datetime').notNullable().index();
    table.string('location', 255).nullable();
    table.enum('event_type', ['public', 'private']).defaultTo('public').index();

    table.index(['start_datetime', 'event_type']);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('events');
}

