// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  varchar,
  integer,
  bigint,
} from "drizzle-orm/pg-core";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name: any) => { 
  console.log("[!]\tschema.ts - name: ", name)
  return`raffleframe-xyz_${name}`
});

// export const images = createTable(
//   "image",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }).notNull(),
//     url: varchar("url", { length: 1024 }).notNull(),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt"),
//   },
//   (example: { name: any; }) => ({
//     nameIndex: index("name_idx").on(example.name),
//   })
// );

// create raffles table
export const raffles = createTable(
  "raffle",
  {
    id: serial("id").primaryKey(),
    description: varchar("description", { length: 256 }),
    creator: varchar("creator", { length: 256 }).notNull(),
    contract: varchar("contract", { length: 256 }).notNull(),
    blockchain: varchar("blockchain", { length: 256 }).notNull(),
    startTime: bigint("startTime", { mode: "number"}),
    endTime: bigint("endTime", { mode: "number" }).notNull(),
    imageUrl: varchar("imageUrl", { length: 256 }),
    website: varchar("website", { length: 256 }),
    winnerFid: integer("winnerFid"),
    winnerUsername: varchar("winnerUsername", { length: 256 }),
    reward: varchar("reward", { length: 256 }).notNull(),
    title: varchar("title", { length: 256 }),
  },
  (example: any) => ({
    idIndex: index("id_idx").on(example.id),
  })
);

// create raffle_entries table
export const raffle_entries = createTable(
  "raffle_entry",
  {
    entryKey: varchar("entryKey", { length: 256 }).primaryKey(),
    fid: varchar("fid", { length: 256 }).notNull(),
    wallet: varchar("wallet", { length: 256 }),
    raffleId: integer("raffleId").notNull(),
    nftId: integer("nftId").notNull(),
    submitTime: bigint("submitTime", { mode: "number"}).notNull(),
    username: varchar("username", { length: 256 }).notNull(),
  },
  (example: any) => ({
    entryKeyIndex: index("entryKey_idx").on(example.entryKey),
  })
);

