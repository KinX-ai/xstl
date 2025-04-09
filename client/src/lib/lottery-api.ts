import { apiRequest } from "./queryClient";

// Taxas de prêmio agora são buscadas da API sempre que necessário
// usando a função fetchPrizeRates() abaixo, em vez de usar constantes hardcoded

// Lấy tỷ lệ thắng từ server
export async function fetchPrizeRates(): Promise<any> {
  const response = await apiRequest("GET", "/api/admin/prize-rates");
  return response.json();
}

export const DEFAULT_LO_AMOUNT = 24000; // 1 điểm lô = 24.000 VNĐ

export interface LotteryResult {
  date: string;
  drawState?: "drawing" | "complete";
  drawTime?: string;
  results: {
    special: string;
    first: string;
    second: string[];
    third: string[];
    fourth: string[];
    fifth: string[];
    sixth: string[];
    seventh: string[];
  };
}

export interface BetRequest {
  numbers: string[];
  amount: number;
  betType: string;
}

export async function fetchLatestResults(): Promise<LotteryResult> {
  const response = await apiRequest("GET", "/api/lottery/results/latest");
  return response.json();
}

export async function fetchResults(): Promise<LotteryResult[]> {
  const response = await apiRequest("GET", "/api/lottery/results");
  return response.json();
}

export async function fetchResultsByDate(date: string): Promise<LotteryResult> {
  const response = await apiRequest("GET", `/api/lottery/results/date/${date}`);
  return response.json();
}

export async function fetchAvailableDates(): Promise<string[]> {
  const response = await apiRequest("GET", "/api/lottery/available-dates");
  return response.json();
}

export async function placeBet(betData: BetRequest): Promise<any> {
  const response = await apiRequest("POST", "/api/bets", betData);
  return response.json();
}

export async function getUserBets(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/bets");
  return response.json();
}

export async function createTransaction(transactionData: {
  type: string;
  amount: number;
  details?: string;
  status: string;
}): Promise<any> {
  const response = await apiRequest("POST", "/api/transactions", transactionData);
  return response.json();
}

// Admin function to process a specific transaction
export async function processTransaction(transactionId: number): Promise<any> {
  const response = await apiRequest("POST", `/api/admin/process-transaction/${transactionId}`);
  return response.json();
}

export async function getUserTransactions(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/transactions");
  return response.json();
}

// Admin functions
export async function getAdminUsers(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/admin/users");
  return response.json();
}

export async function getPendingTransactions(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/admin/pending-transactions");
  return response.json();
}

export async function getPendingBets(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/admin/pending-bets");
  return response.json();
}

export async function processAdminBalance(data: {
  userId: number;
  amount: number;
  type: "deposit" | "withdraw";
  details?: string;
}): Promise<any> {
  const response = await apiRequest("POST", "/api/admin/process-balance", data);
  return response.json();
}

export async function processPrizes(): Promise<any> {
  const response = await apiRequest("POST", "/api/admin/process-prizes");
  return response.json();
}

// Helper function to check if a number is a winner
export function checkWinner(number: string, results: LotteryResult): boolean {
  // For numbers of different lengths we check different things
  const length = number.length;
  const resultsData = results.results;
  
  if (length === 2) {
    // Check if the 2 digits match any of the results (lô 2 số or đề)
    const twoDigits = number;
    
    // Check special prize (last 2 digits)
    if (resultsData.special.endsWith(twoDigits)) return true;
    
    // Check first prize (last 2 digits)
    if (resultsData.first.endsWith(twoDigits)) return true;
    
    // Check second prize (last 2 digits)
    for (const result of resultsData.second) {
      if (result.endsWith(twoDigits)) return true;
    }
    
    // Check third prize (last 2 digits)
    for (const result of resultsData.third) {
      if (result.endsWith(twoDigits)) return true;
    }
    
    // Check fourth prize
    for (const result of resultsData.fourth) {
      if (result === twoDigits) return true;
    }
    
    // Check fifth prize
    for (const result of resultsData.fifth) {
      if (result.endsWith(twoDigits)) return true;
    }
    
    // Check sixth prize
    for (const result of resultsData.sixth) {
      if (result === twoDigits) return true;
    }
    
    // Check seventh prize
    for (const result of resultsData.seventh) {
      if (result === twoDigits) return true;
    }
  } else if (length === 3) {
    // Check if the 3 digits match (3 càng or lô 3 số)
    const threeDigits = number;
    
    // Check special prize (last 3 digits for 3 càng)
    if (resultsData.special.length >= 3 && resultsData.special.endsWith(threeDigits)) return true;
    
    // For lô 3 số, check all prizes for 3 consecutive digits
    // Special prize
    if (resultsData.special.includes(threeDigits)) return true;
    
    // First prize
    if (resultsData.first.includes(threeDigits)) return true;
    
    // Second prizes
    for (const result of resultsData.second) {
      if (result.includes(threeDigits)) return true;
    }
    
    // Third prizes
    for (const result of resultsData.third) {
      if (result.includes(threeDigits)) return true;
    }
    
    // Fourth prizes
    for (const result of resultsData.fourth) {
      if (result.includes(threeDigits)) return true;
    }
    
    // Fifth prizes
    for (const result of resultsData.fifth) {
      if (result.includes(threeDigits)) return true;
    }
    
    // Sixth prizes
    for (const result of resultsData.sixth) {
      if (result.includes(threeDigits)) return true;
    }
  }
  
  return false;
}
