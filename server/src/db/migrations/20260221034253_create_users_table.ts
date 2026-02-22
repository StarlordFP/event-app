import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    
    table.timestamps(true, true);
 });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

