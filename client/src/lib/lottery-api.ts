import { apiRequest } from "./queryClient";

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

export async function getUserTransactions(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/transactions");
  return response.json();
}

// Helper function to check if a number is a winner
export function checkWinner(number: string, results: LotteryResult): boolean {
  // Check if the last two digits match any of the results
  const twoDigits = number.slice(-2);
  
  const resultsData = results.results;
  
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
  
  return false;
}
