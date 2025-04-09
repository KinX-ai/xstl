import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  balance: integer("balance").default(0).notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  numbers: text("numbers").array().notNull(),
  amount: integer("amount").notNull(),
  betType: text("bet_type").notNull(),
  status: text("status").notNull().default("pending"),
  result: text("result"),
  winAmount: integer("win_amount"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  details: text("details"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prizeRates = pgTable("prize_rates", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lotteryResults = pgTable("lottery_results", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phoneNumber: true,
});

export const insertBetSchema = createInsertSchema(bets).pick({
  numbers: true,
  amount: true,
  betType: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  type: true,
  amount: true,
  details: true,
  status: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Bet = typeof bets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type LotteryResult = typeof lotteryResults.$inferSelect;

export const DEFAULT_PRIZE_RATES = {
  special: 80000,    // Đề đặc biệt: 2 số cuối giải ĐB
  dau: 80000,       // Đề đầu: 1 số đầu giải ĐB
  duoi: 80000,      // Đề đuôi: 1 số cuối giải ĐB
  lo2sodau: 70,     // Lô 2 số đầu giải ĐB
  lo2socuoi: 70,    // Lô 2 số cuối giải ĐB
  bacanh: 880,      // Ba càng: 3 số cuối giải ĐB
  xienhai: 15,      // Xiên 2: 2 số trong tất cả giải
  xienba: 40,       // Xiên 3: 3 số trong tất cả giải  
  xienbon: 100      // Xiên 4: 4 số trong tất cả giải
};
