import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tags', (table) => {
    table.bigIncrements('id').primary();
    table.string('name', 50).unique().notNullable().index();
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('tags');
}

