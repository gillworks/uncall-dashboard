import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, varchar, jsonb } from 'drizzle-orm/pg-core';
import { eq, ilike } from 'drizzle-orm';

export const db = drizzle(
  neon(process.env.POSTGRES_URL!, {
    fetchOptions: {
      cache: 'no-store'
    }
  })
);

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  username: varchar('username', { length: 50 }),
  email: varchar('email', { length: 50 })
});

const assistants = pgTable('assistants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  model: jsonb('model'),
  voice: jsonb('voice')
});

export type SelectUser = typeof users.$inferSelect;
export type SelectAssistant = typeof assistants.$inferSelect;

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      users: await db
        .select()
        .from(users)
        .where(ilike(users.name, `%${search}%`))
        .limit(1000),
      newOffset: null
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null };
  }

  const moreUsers = await db.select().from(users).limit(20).offset(offset);
  const newOffset = moreUsers.length >= 20 ? offset + 20 : null;
  return { users: moreUsers, newOffset };
}

export async function getAssistants(
  search: string,
  offset: number
): Promise<{
  assistants: SelectAssistant[];
  newOffset: number | null;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      assistants: await db
        .select()
        .from(assistants)
        .where(ilike(assistants.name, `%${search}%`))
        .limit(1000),
      newOffset: null
    };
  }

  if (offset === null) {
    return { assistants: [], newOffset: null };
  }

  const moreAssistants = await db.select().from(assistants).limit(20).offset(offset);
  const newOffset = moreAssistants.length >= 20 ? offset + 20 : null;
  return { assistants: moreAssistants, newOffset };
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}
