import { users, bets, transactions, lotteryResults } from "@shared/schema";
import type { User, InsertUser, Bet, Transaction, LotteryResult, insertBetSchema, insertTransactionSchema } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, amount: number): Promise<User>;
  
  createBet(bet: any): Promise<Bet>;
  getUserBets(userId: number): Promise<Bet[]>;
  
  createTransaction(transaction: any): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  
  getLotteryResults(): Promise<LotteryResult[]>;
  saveLotteryResults(results: any): Promise<LotteryResult>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bets: Map<number, Bet>;
  private transactions: Map<number, Transaction>;
  private lotteryResults: Map<number, LotteryResult>;
  currentId: number;
  currentBetId: number;
  currentTransactionId: number;
  currentLotteryResultId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.bets = new Map();
    this.transactions = new Map();
    this.lotteryResults = new Map();
    this.currentId = 1;
    this.currentBetId = 1;
    this.currentTransactionId = 1;
    this.currentLotteryResultId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      balance: 500000, // Start with 500,000 VND
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: number, amount: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.balance += amount;
    this.users.set(userId, user);
    return user;
  }

  async createBet(betData: any): Promise<Bet> {
    const id = this.currentBetId++;
    const now = new Date();
    const bet: Bet = {
      id,
      userId: betData.userId,
      numbers: betData.numbers,
      amount: betData.amount,
      betType: betData.betType,
      status: "pending",
      result: null,
      winAmount: null,
      createdAt: now
    };
    this.bets.set(id, bet);
    return bet;
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter(bet => bet.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(transactionData: any): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const now = new Date();
    const transaction: Transaction = {
      id,
      userId: transactionData.userId,
      type: transactionData.type,
      amount: transactionData.amount,
      details: transactionData.details || null,
      status: transactionData.status,
      createdAt: now
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLotteryResults(): Promise<LotteryResult[]> {
    return Array.from(this.lotteryResults.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async saveLotteryResults(results: any): Promise<LotteryResult> {
    const id = this.currentLotteryResultId++;
    const now = new Date();
    const lotteryResult: LotteryResult = {
      id,
      date: new Date(results.date),
      results: results.results,
      createdAt: now
    };
    this.lotteryResults.set(id, lotteryResult);
    return lotteryResult;
  }
}

export const storage = new MemStorage();
