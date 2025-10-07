import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const serversTable = sqliteTable("servers", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text({ length: 1024 }),
  logoUrl: text().notNull(),
  url: text().notNull(),
  createdAt: int().notNull().default(Date.now()),
  updatedAt: int()
    .notNull()
    .default(Date.now())
    .$onUpdate(() => Date.now()),
  features: text(),
  votes: int().notNull().default(0),
});
