import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { getUserTransactions } from "@/lib/lottery-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryIcon, SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransactionsTable from "@/components/lottery/transactions-table";
import { useState } from "react";

export default function TransactionHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
    queryFn: getUserTransactions,
  });

  // Filter transactions based on search query and type
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.details?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          transaction.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <HistoryIcon className="mr-3 text-primary h-8 w-8" /> Lịch Sử Giao Dịch
        </h1>

        <Card>
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <HistoryIcon className="mr-2 h-5 w-5" /> Lịch Sử Giao Dịch
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow relative">
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Tìm kiếm giao dịch..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="bet">Đặt cược</SelectItem>
                  <SelectItem value="win">Trúng thưởng</SelectItem>
                  <SelectItem value="deposit">Nạp tiền</SelectItem>
                  <SelectItem value="withdraw">Rút tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TransactionsTable 
              transactions={filteredTransactions || []} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
