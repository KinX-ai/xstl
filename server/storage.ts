import { users, bets, transactions, lotteryResults } from "@shared/schema";
import type { User, InsertUser, Bet, Transaction, LotteryResult, insertBetSchema, insertTransactionSchema } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { DEFAULT_PRIZE_RATES } from '@shared/schema';

// Add prize rates table name to use in DatabaseStorage
export const PRIZE_RATES_KEY = 'prize_rates';

// Used for in-memory fallback
let prizeRatesConfig = { ...DEFAULT_PRIZE_RATES };


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

  // Prize rates management
  getPrizeRates(): Promise<typeof DEFAULT_PRIZE_RATES>;
  savePrizeRates(rates: typeof DEFAULT_PRIZE_RATES): Promise<typeof DEFAULT_PRIZE_RATES>;

  // For admin access
  users: Map<number, User>;
  bets: Map<number, Bet>;
  transactions: Map<number, Transaction>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  users: Map<number, User> = new Map();
  bets: Map<number, Bet> = new Map();
  transactions: Map<number, Transaction> = new Map();
  sessionStore: session.Store;
  private prizeRatesInMemory: typeof DEFAULT_PRIZE_RATES = { ...DEFAULT_PRIZE_RATES };

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
    this.refreshCaches();
  }

  // Refresh caches from database
  private async refreshCaches() {
    // Load users
    const allUsers = await db.select().from(users);
    this.users.clear();
    allUsers.forEach(user => this.users.set(user.id, user));

    // Load bets
    const allBets = await db.select().from(bets);
    this.bets.clear();
    allBets.forEach(bet => this.bets.set(bet.id, bet));

    // Load transactions  
    const allTransactions = await db.select().from(transactions);
    this.transactions.clear();
    allTransactions.forEach(tx => this.transactions.set(tx.id, tx));
  }

  async createBet(bet: any): Promise<Bet> {
    const result = await db.insert(bets).values(bet).returning();
    const newBet = result[0];
    this.bets.set(newBet.id, newBet);
    return newBet;
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return await db.select().from(bets).where(eq(bets.userId, userId));
  }

  async getPendingBets(): Promise<Bet[]> {
    return await db.select().from(bets).where(eq(bets.status, "pending"));
  }

  async createTransaction(transaction: any): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    const newTransaction = result[0];
    this.transactions.set(newTransaction.id, newTransaction);
    return newTransaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction> {
    const result = await db
      .update(transactions)
      .set({ status })
      .where(eq(transactions.id, id))
      .returning();
    const updatedTransaction = result[0];
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
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

  async getPrizeRates(): Promise<typeof DEFAULT_PRIZE_RATES> {
    // Try to get from database first
    try {
      const result = await db.query('SELECT data FROM prize_rates ORDER BY id DESC LIMIT 1');
      if (result.rows.length > 0) {
        return result.rows[0].data;
      }
    } catch (error) {
      console.error('Error fetching prize rates:', error);
    }
    // Return default if no saved rates
    return DEFAULT_PRIZE_RATES;
  }

  async savePrizeRates(rates: typeof DEFAULT_PRIZE_RATES): Promise<typeof DEFAULT_PRIZE_RATES> {
    try {
      await db.query(
        'INSERT INTO prize_rates (data) VALUES ($1)',
        [rates]
      );
      return rates;
    } catch (error) {
      console.error('Error saving prize rates:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();