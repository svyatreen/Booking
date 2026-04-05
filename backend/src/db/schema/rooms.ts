import { pgTable, text, serial, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { hotelsTable } from "./hotels";

export const roomTypeEnum = pgEnum("room_type", ["single", "double", "deluxe", "suite"]);

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull().references(() => hotelsTable.id, { onDelete: "cascade" }),
  type: roomTypeEnum("type").notNull(),
  price: real("price").notNull(),
  guests: integer("guests").notNull().default(1),
  description: text("description").notNull(),
  images: text("images").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
