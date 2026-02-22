import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex('tags').del();
  await knex('tags').insert([
    { name: 'Birthday' },
    { name: 'Conference' },
    { name: 'Workshop' },
    { name: 'Meetup' },
    { name: 'Webinar' },
    { name: 'Party' },
    { name: 'Sports' },
    { name: 'Music' },
  ]);
}