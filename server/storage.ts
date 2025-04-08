import { users, bets, transactions, lotteryResults } from "@shared/schema";
import type { User, InsertUser, Bet, Transaction, LotteryResult, insertBetSchema, insertTransactionSchema } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, amount: number): Promise<User>;
  
  createBet(bet: any): Promise<Bet>;
  getUserBets(userId: number): Promise<Bet[]>;
  getPendingBets(): Promise<Bet[]>;
  
  createTransaction(transaction: any): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction>;
  
  getLotteryResults(): Promise<LotteryResult[]>;
  saveLotteryResults(results: any): Promise<LotteryResult>;
  
  // For admin access
  users: Map<number, User>;
  bets: Map<number, Bet>;
  transactions: Map<number, Transaction>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  // We still need these for admin access to be compatible with existing code
  users: Map<number, User> = new Map();
  bets: Map<number, Bet> = new Map();
  transactions: Map<number, Transaction> = new Map();
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userToInsert = {
      ...insertUser,
      balance: 0, // Start with 0 VND by default
      role: insertUser.email === "admin@example.com" ? "admin" : "user",
    };

    const result = await db.insert(users).values(userToInsert).returning();
    const newUser = result[0];
    this.users.set(newUser.id, newUser); // Update the Map for admin access
    return newUser;
  }

  async updateUserBalance(userId: number, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newBalance = user.balance + amount;
    const result = await db
      .update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, userId))
      .returning();

    const updatedUser = result[0];
    this.users.set(userId, updatedUser); // Update the Map for admin access
    return updatedUser;
  }

  async createBet(betData: any): Promise<Bet> {
    const betToInsert = {
      userId: betData.userId,
      numbers: betData.numbers,
      amount: betData.amount,
      betType: betData.betType,
      status: "pending",
      result: null,
      winAmount: null,
    };

    const result = await db.insert(bets).values(betToInsert).returning();
    const newBet = result[0];
    this.bets.set(newBet.id, newBet); // Update the Map for admin access
    return newBet;
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    const result = await db
      .select()
      .from(bets)
      .where(eq(bets.userId, userId));
    
    // Sort manually since orderBy is having type issues
    return result.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  async getPendingBets(): Promise<Bet[]> {
    const result = await db
      .select()
      .from(bets)
      .where(eq(bets.status, "pending"));
    
    // Sort manually since orderBy is having type issues
    return result.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async createTransaction(transactionData: any): Promise<Transaction> {
    const transactionToInsert = {
      userId: transactionData.userId,
      type: transactionData.type,
      amount: transactionData.amount,
      details: transactionData.details || null,
      status: transactionData.status,
    };

    const result = await db
      .insert(transactions)
      .values(transactionToInsert)
      .returning();

    const newTransaction = result[0];
    this.transactions.set(newTransaction.id, newTransaction); // Update the Map for admin access
    return newTransaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
    
    // Sort manually since orderBy is having type issues
    return result.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const result = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    
    return result[0];
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<Transaction> {
    const result = await db
      .update(transactions)
      .set({ status })
      .where(eq(transactions.id, id))
      .returning();
    
    const updatedTransaction = result[0];
    this.transactions.set(id, updatedTransaction); // Update the Map for admin access
    return updatedTransaction;
  }

  async getLotteryResults(): Promise<LotteryResult[]> {
    const result = await db
      .select()
      .from(lotteryResults);
    
    // Sort manually since orderBy is having type issues
    return result.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async saveLotteryResults(results: any): Promise<LotteryResult> {
    const lotteryResultToInsert = {
      date: new Date(results.date),
      results: results.results,
    };

    const result = await db
      .insert(lotteryResults)
      .values(lotteryResultToInsert)
      .returning();

    return result[0];
  }
}

export const storage = new DatabaseStorage();
