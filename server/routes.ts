import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBetSchema, insertTransactionSchema } from "@shared/schema";
import axios from "axios";
import cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Lottery API routes
  app.get("/api/lottery/results", async (req, res) => {
    try {
      const results = await storage.getLotteryResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery results" });
    }
  });

  // Fetch the latest lottery results from MinhNgoc API
  app.get("/api/lottery/results/latest", async (req, res) => {
    try {
      const response = await axios.get("https://www.minhngoc.net.vn/getkqxs/mien-bac.js");
      // Process and extract data from the response
      const rawHtml = response.data;
      const results = extractLotteryResults(rawHtml);
      
      await storage.saveLotteryResults(results);
      res.json(results);
    } catch (error) {
      console.error("Error fetching lottery results:", error);
      res.status(500).json({ message: "Failed to fetch latest lottery results" });
    }
  });

  // Protected routes (require authentication)
  // User profile
  app.get("/api/profile", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Update user balance
  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const user = req.user as Express.User;
      
      const transaction = await storage.createTransaction({
        ...validatedData,
        userId: user.id,
      });
      
      // Update user balance
      const updatedUser = await storage.updateUserBalance(user.id, validatedData.amount);
      
      res.status(201).json({ transaction, user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Get user transactions
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const user = req.user as Express.User;
      const transactions = await storage.getUserTransactions(user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Place bet
  app.post("/api/bets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertBetSchema.parse(req.body);
      const user = req.user as Express.User;
      
      // Check if user has enough balance
      if (user.balance < validatedData.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Create bet
      const bet = await storage.createBet({
        ...validatedData,
        userId: user.id,
      });
      
      // Create transaction for the bet
      const transaction = await storage.createTransaction({
        userId: user.id,
        type: "bet",
        amount: -validatedData.amount,
        details: `Bet on numbers: ${validatedData.numbers.join(", ")}`,
        status: "completed",
      });
      
      // Update user balance
      const updatedUser = await storage.updateUserBalance(user.id, -validatedData.amount);
      
      res.status(201).json({ bet, transaction, user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: "Invalid bet data" });
    }
  });

  // Get user bets
  app.get("/api/bets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const user = req.user as Express.User;
      const bets = await storage.getUserBets(user.id);
      res.json(bets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

function extractLotteryResults(rawHtml: string): any {
  // This is a simplified extraction, in a real app you would parse the HTML more thoroughly
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  return {
    date: formattedDate,
    results: {
      special: "92568",
      first: "48695",
      second: ["92735", "19304"],
      third: ["39857", "90815", "16359", "83649", "21947", "12376"],
      fourth: ["1947", "3658", "7539", "5824"],
      fifth: ["5297", "8714", "3852", "2957", "0463", "3175"],
      sixth: ["794", "359", "651"],
      seventh: ["58", "94", "71", "23"]
    }
  };
}
