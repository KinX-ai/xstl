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
  
  // Get lottery results by date
  app.get("/api/lottery/results/date/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const results = await storage.getLotteryResults();
      
      // Find result by date
      const result = results.find(r => {
        // Convert to string and compare with the date parameter
        const resultDate = typeof r.date === 'string' ? r.date : r.date.toISOString();
        return resultDate.includes(date);
      });
      
      if (result) {
        res.json({...result, drawState: "complete"});
      } else {
        // If no result found for the specified date, return 404
        res.status(404).json({ message: "No results found for the specified date" });
      }
    } catch (error) {
      console.error("Error fetching lottery results by date:", error);
      res.status(500).json({ message: "Failed to fetch lottery results" });
    }
  });
  
  // Get available dates with lottery results
  app.get("/api/lottery/available-dates", async (req, res) => {
    try {
      const results = await storage.getLotteryResults();
      // Extract dates from results
      const dates = results.map(result => {
        const resultDate = typeof result.date === 'string' ? result.date : result.date.toISOString();
        return resultDate.split('T')[0];
      });
      res.json(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      res.status(500).json({ message: "Failed to fetch available dates" });
    }
  });

  // Fetch the latest lottery results from xoso188.net API
  app.get("/api/lottery/results/latest", async (req, res) => {
    try {
      // Kiểm tra thời gian hiện tại để xác định nên trả về kết quả nào
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Nếu đang trong thời gian quay số (18:15 - 19:15), trả về trạng thái đang quay
      if ((hours === 18 && minutes >= 15) || (hours === 19 && minutes < 15)) {
        return res.json(createDrawingLotteryResult());
      }
      
      // Try to get cached results first
      const cachedResults = await storage.getLotteryResults();
      if (cachedResults && cachedResults.length > 0) {
        const result = { ...cachedResults[0], drawState: "complete" };
        return res.json(result);
      }
      
      // Fetch results from xoso188.net API
      console.log("Attempting to fetch from xoso188.net API");
      
      try {
        const apiResponse = await axios.get("https://xoso188.net/api/front/open/lottery/history/list/5/miba");
        const apiData = apiResponse.data;
        
        if (apiData && apiData.data && apiData.data.length > 0) {
          // Lấy kết quả mới nhất
          const latestData = apiData.data[0];
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          
          // Chuyển đổi dữ liệu từ API sang định dạng của ứng dụng
          const special = latestData.jackpot1 || "";
          const first = latestData.giainhat || "";
          const second = latestData.giainhi ? latestData.giainhi.split(",") : [];
          const third = latestData.giaiba ? latestData.giaiba.split(",") : [];
          const fourth = latestData.giaitu ? latestData.giaitu.split(",") : [];
          const fifth = latestData.giainam ? latestData.giainam.split(",") : [];
          const sixth = latestData.giaisau ? latestData.giaisau.split(",") : [];
          const seventh = latestData.giaibay ? latestData.giaibay.split(",") : [];
          
          // Kiểm tra trạng thái quay thưởng
          const isDrawing = today.getHours() >= 18 && today.getHours() < 19;
          const isDrawingComplete = special && first && second.length > 0 && third.length > 0 && 
                                  fourth.length > 0 && fifth.length > 0 && sixth.length > 0 && seventh.length > 0;
          
          const results = {
            date: formattedDate,
            drawState: isDrawing && !isDrawingComplete ? "drawing" : "complete",
            drawTime: latestData.time || "18:15 - 19:15",
            results: {
              special: special || (isDrawing ? "" : "92568"),
              first: first || (isDrawing ? "" : "48695"),
              second: second.length > 0 ? second : (isDrawing ? Array(2).fill("") : ["92735", "19304"]),
              third: third.length > 0 ? third : (isDrawing ? Array(6).fill("") : ["39857", "90815", "16359", "83649", "21947", "12376"]),
              fourth: fourth.length > 0 ? fourth : (isDrawing ? Array(4).fill("") : ["1947", "3658", "7539", "5824"]),
              fifth: fifth.length > 0 ? fifth : (isDrawing ? Array(6).fill("") : ["5297", "8714", "3852", "2957", "0463", "3175"]),
              sixth: sixth.length > 0 ? sixth : (isDrawing ? Array(3).fill("") : ["794", "359", "651"]),
              seventh: seventh.length > 0 ? seventh : (isDrawing ? Array(4).fill("") : ["58", "94", "71", "23"])
            }
          };
          
          console.log("Successfully fetched results from xoso188.net API");
          await storage.saveLotteryResults(results);
          return res.json(results);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (apiError) {
        console.error("Error fetching or parsing API data:", apiError);
        
        // Tạo kết quả thay thế nếu đang trong thời gian quay thưởng
        const now = new Date();
        const isDrawing = now.getHours() >= 18 && now.getHours() < 19;
        
        if (isDrawing) {
          // Trong thời gian quay thưởng, trả về kết quả rỗng để hiển thị đang quay
          const drawingResult = createDrawingLotteryResult();
          await storage.saveLotteryResults(drawingResult);
          return res.json(drawingResult);
        } else {
          // Ngoài thời gian quay thưởng, trả về kết quả mẫu
          const mockResult = createMockLotteryResult();
          await storage.saveLotteryResults(mockResult);
          return res.json(mockResult);
        }
      }
    } catch (error) {
      console.error("Error fetching lottery results:", error);
      
      // Tạo kết quả thay thế nếu đang trong thời gian quay thưởng
      const now = new Date();
      const isDrawing = now.getHours() >= 18 && now.getHours() < 19;
      
      if (isDrawing) {
        // Trong thời gian quay thưởng, trả về kết quả rỗng để hiển thị đang quay
        const drawingResult = createDrawingLotteryResult();
        await storage.saveLotteryResults(drawingResult);
        return res.json(drawingResult);
      } else {
        // Ngoài thời gian quay thưởng, trả về kết quả mẫu
        const mockResult = createMockLotteryResult();
        await storage.saveLotteryResults(mockResult);
        return res.json(mockResult);
      }
    }
  });

  // Protected routes (require authentication)
  // User profile
  app.get("/api/profile", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Request a deposit or withdrawal (user can only request, admin must approve)
  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const user = req.user as Express.User;
      
      // For deposits and withdrawals, set status to 'pending' for admin approval
      let status = "pending";
      
      // Create transaction with pending status
      const transaction = await storage.createTransaction({
        ...validatedData,
        userId: user.id,
        status: status
      });
      
      res.status(201).json({ transaction, user });
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
      // Kiểm tra giới hạn thời gian đặt cược (chỉ được đặt cược trước 18:15)
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours > 18 || (hours === 18 && minutes >= 15)) {
        return res.status(400).json({ 
          message: "Đã quá thời gian đặt cược. Thời gian đặt cược chỉ đến 18:15 mỗi ngày."
        });
      }
      
      const validatedData = insertBetSchema.parse(req.body);
      const user = req.user as Express.User;
      
      // Check if user has enough balance
      if (user.balance < validatedData.amount) {
        return res.status(400).json({ message: "Số dư không đủ" });
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
        details: `Đặt cược ${validatedData.betType}: ${validatedData.numbers.join(", ")}`,
        status: "completed",
      });
      
      // Update user balance
      const updatedUser = await storage.updateUserBalance(user.id, -validatedData.amount);
      
      res.status(201).json({ bet, transaction, user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: "Dữ liệu đặt cược không hợp lệ" });
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
  
  // ------------ ADMIN ROUTES ------------
  
  // Get all users (admin only)
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      // In a real app, would get from database
      // For now, return all users from memory
      const users = Array.from(storage.users.values());
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // Get pending bets that need to be processed (admin only)
  app.get("/api/admin/pending-bets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      // Get all bets with status "pending"
      const pendingBets = Array.from(storage.bets.values())
        .filter(bet => bet.status === "pending")
        .map(async (bet) => {
          // Get username for each bet
          const user = await storage.getUser(bet.userId);
          return {
            ...bet,
            username: user?.username || "Unknown",
          };
        });
        
      const betsWithUsernames = await Promise.all(pendingBets);
      
      res.json(betsWithUsernames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending bets" });
    }
  });
  
  // Get pending transactions (deposits/withdrawals) that need to be processed (admin only)
  app.get("/api/admin/pending-transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      // Get all transactions with status "pending"
      const pendingTransactions = Array.from(storage.transactions.values())
        .filter(transaction => transaction.status === "pending")
        .map(async (transaction) => {
          // Get username for each transaction
          const user = await storage.getUser(transaction.userId);
          return {
            ...transaction,
            username: user?.username || "Unknown",
          };
        });
        
      const transactionsWithUsernames = await Promise.all(pendingTransactions);
      
      res.json(transactionsWithUsernames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending transactions" });
    }
  });
  
  // Process a specific transaction by ID (admin only)
  app.post("/api/admin/process-transaction/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      const transactionId = parseInt(req.params.id);
      if (isNaN(transactionId)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }
      
      // Find the transaction
      const transaction = Array.from(storage.transactions.values())
        .find(t => t.id === transactionId && t.status === "pending");
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found or already processed" });
      }
      
      // Get the user
      const user = await storage.getUser(transaction.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Process the transaction based on type
      if (transaction.type === "deposit") {
        // Add funds to user's account
        await storage.updateUserBalance(user.id, transaction.amount);
      } else if (transaction.type === "withdraw") {
        // Check if user has enough balance
        if (user.balance < transaction.amount) {
          return res.status(400).json({ message: "User has insufficient balance" });
        }
        // Deduct funds from user's account
        await storage.updateUserBalance(user.id, -transaction.amount);
      } else {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
      
      // Update transaction status
      await storage.updateTransactionStatus(transaction.id, "completed");
      
      // Get updated transaction and user data
      const updatedTransaction = await storage.getTransactionById(transactionId);
      const updatedUser = await storage.getUser(user.id);
      
      // Create a response record
      const processedTransaction = {
        ...updatedTransaction,
        userBalance: updatedUser?.balance || 0
      };
      
      res.json(processedTransaction);
    } catch (error) {
      console.error("Error processing transaction:", error);
      res.status(500).json({ message: "Failed to process transaction" });
    }
  });
  
  // Get prize rates (admin only)
  app.get("/api/admin/prize-rates", async (req, res) => {
    // In a real implementation, we'd get this from database
    // For now, just return static values
    const prizeRates = {
      special: 80000, // Đặc biệt: 1 số trúng x 80.000đ
      first: 25000,   // Giải nhất: 1 số trúng x 25.000đ
      second: 10000,  // Giải nhì: 1 số trúng x 10.000đ
      third: 5000,    // Giải ba: 1 số trúng x 5.000đ
      fourth: 1200,   // Giải tư: 1 số trúng x 1.200đ
      fifth: 600,     // Giải năm: 1 số trúng x 600đ
      sixth: 400,     // Giải sáu: 1 số trúng x 400đ
      seventh: 200,   // Giải bảy: 1 số trúng x 200đ
      // Các tỷ lệ cho lô
      lo2so: 70,      // Lô 2 số: 1 số trúng x 70đ
      lo3so: 700,     // Lô 3 số: 1 số trúng x 700đ
      bacanh: 880,    // Ba càng: 1 số trúng x 880đ
      xienhai: 15,    // Xiên 2: 1 cặp trúng x 15đ
      xienba: 40,     // Xiên 3: 1 bộ 3 trúng x 40đ
      xienbon: 100,   // Xiên 4: 1 bộ 4 trúng x 100đ
    };
    
    res.json(prizeRates);
  });
  
  // Save prize rates (admin only)
  app.post("/api/admin/prize-rates", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      // In a real implementation, we'd save this to database
      // For now, just return the received data
      res.json(req.body);
    } catch (error) {
      res.status(500).json({ message: "Failed to save prize rates" });
    }
  });
  
  // Generate new lottery results (admin only)
  app.post("/api/admin/generate-results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      const mockResult = await createMockLotteryResult();
      res.json(mockResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate lottery results" });
    }
  });
  
  // Admin route for processing deposit/withdrawal requests (admin only)
  app.post("/api/admin/process-balance", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      const { userId, amount, type, details } = req.body;
      
      if (!userId || !amount || !type) {
        return res.status(400).json({ message: "Thiếu thông tin giao dịch" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      
      // Process deposit or withdrawal
      const transactionAmount = type === "deposit" ? Math.abs(amount) : -Math.abs(amount);
      
      // Create transaction
      const transaction = await storage.createTransaction({
        userId,
        type,
        amount: transactionAmount,
        details: details || (type === "deposit" ? "Nạp tiền" : "Rút tiền"),
        status: "completed"
      });
      
      // Update user balance
      const updatedUser = await storage.updateUserBalance(userId, transactionAmount);
      
      res.status(200).json({ success: true, transaction, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Lỗi xử lý giao dịch" });
    }
  });
  
  // Process and pay out prizes for pending bets (admin only)
  app.post("/api/admin/process-prizes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    try {
      // Kiểm tra giới hạn thời gian trả thưởng (chỉ được trả thưởng sau 19:59)
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours < 19 || (hours === 19 && minutes < 59)) {
        return res.status(400).json({ 
          message: "Chưa đến thời gian trả thưởng. Thời gian trả thưởng là sau 19:59 mỗi ngày." 
        });
      }
      
      // Get the latest lottery results
      const results = await storage.getLotteryResults();
      if (results.length === 0) {
        return res.status(400).json({ message: "Chưa có kết quả xổ số cho ngày hôm nay" });
      }
      
      const latestResult = results[0];
      const lotteryResults = latestResult.results as any;
      
      // Get all pending bets
      const pendingBets = Array.from(storage.bets.values())
        .filter(bet => bet.status === "pending");
      
      let processedCount = 0;
      let totalWinAmount = 0;
      
      // Process each bet
      for (const bet of pendingBets) {
        // Kiểm tra vé số có trúng thưởng không
        let hasWon = false;
        let winMultiplier = 0;
        
        // Logic kiểm tra vé trúng (đơn giản hóa)
        // Trong thực tế, logic này sẽ phức tạp hơn và phụ thuộc vào loại vé
        // Đây chỉ là mô phỏng cho mục đích demo
        switch (bet.betType) {
          case "de": // Đề (2 số cuối của giải đặc biệt)
            const special = lotteryResults.special;
            const lastTwo = special.slice(-2);
            hasWon = bet.numbers.includes(lastTwo);
            winMultiplier = 80;
            break;
          case "lo": // Lô (2 số bất kỳ trong tất cả các giải)
            const allNumbers = [
              lotteryResults.special,
              lotteryResults.first,
              ...lotteryResults.second,
              ...lotteryResults.third,
              ...lotteryResults.fourth,
              ...lotteryResults.fifth,
              ...lotteryResults.sixth,
              ...lotteryResults.seventh
            ];
            
            // Lấy 2 số cuối của mỗi giải
            const lastTwoDigits = allNumbers.map(num => num.slice(-2));
            
            // Kiểm tra xem số người chơi đặt có xuất hiện trong kết quả không
            hasWon = bet.numbers.some(num => lastTwoDigits.includes(num));
            winMultiplier = 70;
            break;
          case "xien2": // Xiên 2 (2 số lô cùng về)
            // Giả lập: 10% xác suất thắng
            hasWon = Math.random() < 0.1;
            winMultiplier = 15;
            break;
          case "xien3": // Xiên 3 (3 số lô cùng về)
            // Giả lập: 5% xác suất thắng
            hasWon = Math.random() < 0.05;
            winMultiplier = 40;
            break;
          case "xien4": // Xiên 4 (4 số lô cùng về)
            // Giả lập: 2% xác suất thắng
            hasWon = Math.random() < 0.02;
            winMultiplier = 100;
            break;
          case "bacanh": // Ba càng (3 số cuối của giải đặc biệt)
            const specialNum = lotteryResults.special;
            const lastThree = specialNum.slice(-3);
            hasWon = bet.numbers.includes(lastThree);
            winMultiplier = 880;
            break;
          default:
            // Giả lập: 20% xác suất thắng
            hasWon = Math.random() < 0.2;
            winMultiplier = 50;
        }
        
        if (hasWon) {
          const winAmount = bet.amount * winMultiplier;
          
          // Update bet status and win amount
          bet.status = "won";
          bet.winAmount = winAmount;
          bet.result = "won";
          
          // Update user balance
          await storage.updateUserBalance(bet.userId, winAmount);
          
          // Create transaction record for the win
          await storage.createTransaction({
            userId: bet.userId,
            type: "win",
            amount: winAmount,
            details: `Trúng thưởng ${bet.betType}: ${bet.numbers.join(", ")}`,
            status: "completed"
          });
          
          totalWinAmount += winAmount;
        } else {
          // Mark as lost
          bet.status = "lost";
          bet.result = "lost";
          bet.winAmount = 0;
        }
        
        processedCount++;
      }
      
      res.json({
        success: true,
        processed: processedCount,
        winAmount: totalWinAmount
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xử lý trả thưởng" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

function extractLotteryResults(rawHtml: string): any {
  try {
    // First, try to use the standard table approach
    const $ = cheerio.load(rawHtml);
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Try to extract the date from the page
    const dateString = $('.ngay').text().trim();
    let extractedDate = dateString ? dateString : formattedDate;
    
    // Find the result table - try multiple possible selectors
    const resultTable = $('#result_tab_mb, .bangkqxs, .box_kqxs table');
    
    if (resultTable.length > 0) {
      console.log("Found result table using standard selectors");
      
      // Extract special prize
      const specialPrize = resultTable.find('tr:contains("ĐB"), tr:contains("Giải ĐB")').find('td:nth-child(2)').text().trim();
      
      // Extract first prize
      const firstPrize = resultTable.find('tr:contains("1"), tr:contains("Giải nhất")').find('td:nth-child(2)').text().trim();
      
      // Extract second prize
      const secondPrizeRow = resultTable.find('tr:contains("2"), tr:contains("Giải nhì")');
      const secondPrizes = secondPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/).filter(Boolean);
      
      // Extract third prize
      const thirdPrizeRow = resultTable.find('tr:contains("3"), tr:contains("Giải ba")');
      const thirdPrizes = thirdPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/).filter(Boolean);
      
      // Extract fourth prize
      const fourthPrizeRow = resultTable.find('tr:contains("4"), tr:contains("Giải tư")');
      const fourthPrizes = fourthPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/).filter(Boolean);
      
      // Extract fifth prize
      const fifthPrizeRow = resultTable.find('tr:contains("5"), tr:contains("Giải năm")');
      const fifthPrizes = fifthPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/).filter(Boolean);
      
      // Extract sixth prize
      const sixthPrizeRow = resultTable.find('tr:contains("6"), tr:contains("Giải sáu")');
      const sixthPrizes = sixthPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/).filter(Boolean);
      
      // Extract seventh prize
      const seventhPrizeRow = resultTable.find('tr:contains("7"), tr:contains("Giải bảy")');
      const seventhPrizes = seventhPrizeRow.find('td:nth-child(2)').text().trim().split(/\s+/).filter(Boolean);
      
      // If we found valid prizes, return them
      if (specialPrize || firstPrize || secondPrizes.length > 0) {
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
      }
    }
    
    // If the standard approach didn't work, try to extract from embedded script
    console.log("Trying to extract from embedded script");
    const scriptContent = rawHtml.match(/var prize_mb\s*=\s*({[\s\S]*?});/);
    
    if (scriptContent && scriptContent[1]) {
      try {
        // Clean up the script content to make it valid JSON
        const jsonStr = scriptContent[1]
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/,\s*}/g, '}');
        
        const prizeData = JSON.parse(jsonStr);
        const dateMatch = rawHtml.match(/var weekday\s*=\s*"([^"]+)"/);
        if (dateMatch && dateMatch[1]) {
          extractedDate = dateMatch[1];
        }
        
        return {
          date: extractedDate,
          results: {
            special: prizeData.db || "92568",
            first: prizeData.nhat || "48695",
            second: prizeData.nhi ? [prizeData.nhi] : ["92735", "19304"],
            third: (prizeData.ba || "").split(" ").filter(Boolean) || ["39857", "90815", "16359", "83649", "21947", "12376"],
            fourth: (prizeData.tu || "").split(" ").filter(Boolean) || ["1947", "3658", "7539", "5824"],
            fifth: (prizeData.nam || "").split(" ").filter(Boolean) || ["5297", "8714", "3852", "2957", "0463", "3175"],
            sixth: (prizeData.sau || "").split(" ").filter(Boolean) || ["794", "359", "651"],
            seventh: (prizeData.bay || "").split(" ").filter(Boolean) || ["58", "94", "71", "23"]
          }
        };
      } catch (err) {
        console.error("Error parsing script content:", err);
      }
    }
    
    // If we couldn't extract from the embedded script, try the HTML structure specifically for minhngoc.net.vn
    console.log("Trying to extract from alternative HTML structure");
    const minhngocTable = $('.box_kqxs_mini table, .box_kqxs table');
    
    if (minhngocTable.length > 0) {
      const rows = minhngocTable.find('tr');
      let results = {
        special: "",
        first: "",
        second: [] as string[],
        third: [] as string[],
        fourth: [] as string[],
        fifth: [] as string[],
        sixth: [] as string[],
        seventh: [] as string[]
      };
      
      rows.each((index, element) => {
        const cells = $(element).find('td');
        if (cells.length >= 2) {
          const prizeText = $(cells[0]).text().trim();
          const numbers = $(cells[1]).text().trim().split(/\s+/).filter(Boolean);
          
          if (prizeText.includes("ĐB") || prizeText.includes("Đặc biệt")) {
            results.special = numbers[0] || "";
          } else if (prizeText.includes("1") || prizeText.includes("Nhất")) {
            results.first = numbers[0] || "";
          } else if (prizeText.includes("2") || prizeText.includes("Nhì")) {
            results.second = numbers;
          } else if (prizeText.includes("3") || prizeText.includes("Ba")) {
            results.third = numbers;
          } else if (prizeText.includes("4") || prizeText.includes("Tư")) {
            results.fourth = numbers;
          } else if (prizeText.includes("5") || prizeText.includes("Năm")) {
            results.fifth = numbers;
          } else if (prizeText.includes("6") || prizeText.includes("Sáu")) {
            results.sixth = numbers;
          } else if (prizeText.includes("7") || prizeText.includes("Bảy")) {
            results.seventh = numbers;
          }
        }
      });
      
      // If we found any results, return them
      if (results.special || results.first || results.second.length > 0) {
        return {
          date: extractedDate,
          results: {
            special: results.special || "92568",
            first: results.first || "48695",
            second: results.second.length > 0 ? results.second : ["92735", "19304"],
            third: results.third.length > 0 ? results.third : ["39857", "90815", "16359", "83649", "21947", "12376"],
            fourth: results.fourth.length > 0 ? results.fourth : ["1947", "3658", "7539", "5824"],
            fifth: results.fifth.length > 0 ? results.fifth : ["5297", "8714", "3852", "2957", "0463", "3175"],
            sixth: results.sixth.length > 0 ? results.sixth : ["794", "359", "651"],
            seventh: results.seventh.length > 0 ? results.seventh : ["58", "94", "71", "23"]
          }
        };
      }
    }
    
    // If all approaches failed, return null to trigger the fallback
    console.error("Could not find lottery results using any method");
    return null;
  } catch (error) {
    console.error("Error parsing lottery results:", error);
    return null;
  }
}

function createDrawingLotteryResult() {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  return {
    date: formattedDate,
    drawState: "drawing",
    drawTime: "18:15 - 19:15",
    results: {
      special: "",
      first: "",
      second: Array(2).fill(""),
      third: Array(6).fill(""),
      fourth: Array(4).fill(""),
      fifth: Array(6).fill(""),
      sixth: Array(3).fill(""),
      seventh: Array(4).fill("")
    }
  };
}

function createMockLotteryResult() {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  return {
    date: formattedDate,
    drawState: "complete",
    drawTime: "18:15 - 19:15",
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
