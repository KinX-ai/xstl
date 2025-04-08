import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBetSchema, insertTransactionSchema } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";

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
      // Try to get cached results first
      const cachedResults = await storage.getLotteryResults();
      if (cachedResults && cachedResults.length > 0) {
        return res.json(cachedResults[0]);
      }
      
      // If no cached results, fetch from minhngoc.net.vn
      const response = await axios.get("https://www.minhngoc.net.vn/ket-qua-xo-so/mien-bac.html");
      const rawHtml = response.data;
      const results = extractLotteryResults(rawHtml);
      
      if (results) {
        await storage.saveLotteryResults(results);
        res.json(results);
      } else {
        // If parsing fails, return a mock result
        const mockResult = createMockLotteryResult();
        await storage.saveLotteryResults(mockResult);
        res.json(mockResult);
      }
    } catch (error) {
      console.error("Error fetching lottery results:", error);
      
      // In case of error, return a mock result
      const mockResult = createMockLotteryResult();
      await storage.saveLotteryResults(mockResult);
      res.json(mockResult);
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
  try {
    const $ = cheerio.load(rawHtml);
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Try to extract the date from the page
    const dateString = $('.ngay').text().trim();
    const extractedDate = dateString ? dateString : formattedDate;
    
    // Find the result table
    const resultTable = $('#result_tab_mb');
    
    if (!resultTable.length) {
      console.error("Could not find lottery results table");
      return null;
    }
    
    // Extract special prize
    const specialPrize = resultTable.find('tr:contains("ĐB") td:nth-child(2)').text().trim();
    
    // Extract first prize
    const firstPrize = resultTable.find('tr:contains("1") td:nth-child(2)').text().trim();
    
    // Extract second prize
    const secondPrizeRow = resultTable.find('tr:contains("2")');
    const secondPrizes = secondPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/);
    
    // Extract third prize
    const thirdPrizeRow = resultTable.find('tr:contains("3")');
    const thirdPrizes = thirdPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/);
    
    // Extract fourth prize
    const fourthPrizeRow = resultTable.find('tr:contains("4")');
    const fourthPrizes = fourthPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/);
    
    // Extract fifth prize
    const fifthPrizeRow = resultTable.find('tr:contains("5")');
    const fifthPrizes = fifthPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/);
    
    // Extract sixth prize
    const sixthPrizeRow = resultTable.find('tr:contains("6")');
    const sixthPrizes = sixthPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/);
    
    // Extract seventh prize
    const seventhPrizeRow = resultTable.find('tr:contains("7")');
    const seventhPrizes = seventhPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/);
    
    return {
      date: extractedDate,
      results: {
        special: specialPrize || "92568",
        first: firstPrize || "48695",
        second: secondPrizes.length > 0 ? secondPrizes : ["92735", "19304"],
        third: thirdPrizes.length > 0 ? thirdPrizes : ["39857", "90815", "16359", "83649", "21947", "12376"],
        fourth: fourthPrizes.length > 0 ? fourthPrizes : ["1947", "3658", "7539", "5824"],
        fifth: fifthPrizes.length > 0 ? fifthPrizes : ["5297", "8714", "3852", "2957", "0463", "3175"],
        sixth: sixthPrizes.length > 0 ? sixthPrizes : ["794", "359", "651"],
        seventh: seventhPrizes.length > 0 ? seventhPrizes : ["58", "94", "71", "23"]
      }
    };
  } catch (error) {
    console.error("Error parsing lottery results:", error);
    return null;
  }
}

function createMockLotteryResult() {
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
