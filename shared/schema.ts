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
  special: 80000, // Đặc biệt: 1 số trúng x 80.000đ
  first: 25000,   // Giải nhất: 1 số trúng x 25.000đ
  second: 10000,  // Giải nhì: 1 số trúng x 10.000đ
  third: 5000,    // Giải ba: 1 số trúng x 5.000đ
  fourth: 1200,   // Giải tư: 1 số trúng x 1.200đ
  fifth: 600,     // Giải năm: 1 số trúng x 600đ
  sixth: 400,     // Giải sáu: 1 số trúng x 400đ
  seventh: 200,   // Giải bảy: 1 số trúng x 200đ
  lo2so: 70,      // Lô 2 số: 1 số trúng x 70đ
  lo3so: 700,     // Lô 3 số: 1 số trúng x 700đ
  bacanh: 880,    // Ba càng: 1 số trúng x 880đ
  xienhai: 15,    // Xiên 2: 1 cặp trúng x 15đ
  xienba: 40,     // Xiên 3: 1 bộ 3 trúng x 40đ
  xienbon: 100    // Xiên 4: 1 bộ 4 trúng x 100đ
};
