import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const serversTable = sqliteTable("servers", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text({ length: 1024 }),
  logoUrl: text().notNull(),
  url: text().notNull().unique(),
  createdAt: int().notNull().default(Date.now()),
  updatedAt: int()
    .notNull()
    .default(Date.now())
    .$onUpdate(() => Date.now()),
  features: text(),
  votes: int().notNull().default(0),
});

export const ipVotesTable = sqliteTable("ip_votes", {
  ipAddress: text().notNull().primaryKey(),
  lastVoted: int().notNull().default(Date.now())
}, (table) => [
  unique().on(table.ipAddress)
]);

export const votesTable = sqliteTable("votes", {
  id: int().primaryKey({ autoIncrement: true }),
  serverId: int().notNull().references(() => serversTable.id),
  userId: int().notNull(),
  lastVoted: int().notNull().default(Date.now())
}, (table) => [
  unique().on(table.serverId, table.userId)
]);
