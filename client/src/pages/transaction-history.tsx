import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { getUserBets, getUserTransactions } from "@/lib/lottery-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  HistoryIcon, 
  SearchIcon, 
  BadgeCheck, 
  BadgeDollarSign, 
  CalendarIcon,
  CreditCard,
  ListFilter,
  ClockIcon,
  CheckCheckIcon,
  XCircleIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TransactionsTable from "@/components/lottery/transactions-table";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

type BetStatusType = "pending" | "won" | "lost";

export default function TransactionHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [betStatusFilter, setBetStatusFilter] = useState<BetStatusType | "all">("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedBet, setSelectedBet] = useState<any>(null);
  
  // Lấy lịch sử giao dịch
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["/api/transactions"],
    queryFn: getUserTransactions,
  });

  // Lấy lịch sử đặt cược
  const { data: bets, isLoading: isLoadingBets } = useQuery({
    queryKey: ["/api/bets"],
    queryFn: getUserBets,
  });

  // Filter transactions based on search query and type
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = (transaction.details?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          transaction.type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    
    // Filter by date range
    let matchesDate = true;
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.createdAt);
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      
      if (dateRange === "today") {
        matchesDate = 
          transactionDate.getDate() === today.getDate() && 
          transactionDate.getMonth() === today.getMonth() && 
          transactionDate.getFullYear() === today.getFullYear();
      } else if (dateRange === "7days") {
        matchesDate = transactionDate >= last7Days;
      } else if (dateRange === "30days") {
        matchesDate = transactionDate >= last30Days;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Hàm tính tổng tiền theo loại giao dịch
  const calculateTotal = (type: string) => {
    if (!transactions) return 0;
    
    return transactions
      .filter(t => t.type === type)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  // Lọc bet dựa vào trạng thái và tìm kiếm
  const filteredBets = bets?.filter(bet => {
    const matchesSearch = bet.numbers.some((num: string) => 
      num.includes(searchQuery) || 
      bet.betType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesStatus = betStatusFilter === "all" || bet.status === betStatusFilter;
    
    // Filter by date range
    let matchesDate = true;
    if (dateRange !== "all") {
      const betDate = new Date(bet.createdAt);
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      
      if (dateRange === "today") {
        matchesDate = 
          betDate.getDate() === today.getDate() && 
          betDate.getMonth() === today.getMonth() && 
          betDate.getFullYear() === today.getFullYear();
      } else if (dateRange === "7days") {
        matchesDate = betDate >= last7Days;
      } else if (dateRange === "30days") {
        matchesDate = betDate >= last30Days;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Hiển thị chi tiết bet khi người dùng click vào một bet
  const showBetDetails = (bet: any) => {
    setSelectedBet(bet);
  };

  // Hiển thị trạng thái bet (pending, won, lost)
  const renderBetStatus = (status: BetStatusType) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang chờ kết quả</Badge>;
      case "won":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Trúng thưởng</Badge>;
      case "lost":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Không trúng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Không xác định</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <HistoryIcon className="mr-3 text-primary h-8 w-8" /> Lịch Sử Hoạt Động
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BadgeDollarSign className="mr-2 h-5 w-5 text-green-500" /> Tổng Tiền Đã Nạp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {calculateTotal("deposit").toLocaleString()}đ
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-red-500" /> Tổng Tiền Đã Cược
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {Math.abs(calculateTotal("bet")).toLocaleString()}đ
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BadgeCheck className="mr-2 h-5 w-5 text-primary" /> Tổng Tiền Thắng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {calculateTotal("win").toLocaleString()}đ
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="transactions">Lịch Sử Giao Dịch</TabsTrigger>
            <TabsTrigger value="bets">Lịch Sử Đặt Cược</TabsTrigger>
          </TabsList>
          
          {/* Tab Lịch Sử Giao Dịch */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HistoryIcon className="mr-2 h-5 w-5" /> Lịch Sử Giao Dịch
                </CardTitle>
                <CardDescription>
                  Tất cả các giao dịch nạp tiền, rút tiền, đặt cược và trúng thưởng
                </CardDescription>
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
                  <div className="flex gap-2">
                    <Select 
                      value={transactionType}
                      onValueChange={setTransactionType}
                    >
                      <SelectTrigger className="w-[150px]">
                        <ListFilter className="h-4 w-4 mr-2" />
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
                    
                    <Select 
                      value={dateRange}
                      onValueChange={setDateRange}
                    >
                      <SelectTrigger className="w-[150px]">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Khoảng thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="7days">7 ngày qua</SelectItem>
                        <SelectItem value="30days">30 ngày qua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <TransactionsTable 
                  transactions={filteredTransactions || []} 
                  isLoading={isLoadingTransactions} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Lịch Sử Đặt Cược */}
          <TabsContent value="bets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeDollarSign className="mr-2 h-5 w-5" /> Lịch Sử Đặt Cược
                </CardTitle>
                <CardDescription>
                  Danh sách các vé số đã đặt và trạng thái trúng thưởng
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-grow relative">
                    <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Tìm kiếm vé số..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={betStatusFilter}
                      onValueChange={(value) => setBetStatusFilter(value as BetStatusType | "all")}
                    >
                      <SelectTrigger className="w-[150px]">
                        <ListFilter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Đang chờ kết quả</SelectItem>
                        <SelectItem value="won">Trúng thưởng</SelectItem>
                        <SelectItem value="lost">Không trúng</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={dateRange}
                      onValueChange={setDateRange}
                    >
                      <SelectTrigger className="w-[150px]">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Khoảng thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="7days">7 ngày qua</SelectItem>
                        <SelectItem value="30days">30 ngày qua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {isLoadingBets ? (
                  <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredBets && filteredBets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Loại cược</TableHead>
                          <TableHead>Số đã chọn</TableHead>
                          <TableHead className="text-right">Số tiền cược</TableHead>
                          <TableHead className="text-center">Trạng thái</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBets.map((bet) => (
                          <TableRow key={bet.id}>
                            <TableCell>
                              {new Date(bet.createdAt).toLocaleDateString('vi-VN')}
                              <div className="text-xs text-gray-500">
                                {new Date(bet.createdAt).toLocaleTimeString('vi-VN')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{bet.betType}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {bet.numbers.map((num: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="font-mono">
                                    {num}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono font-medium">
                              {bet.amount.toLocaleString()}đ
                            </TableCell>
                            <TableCell className="text-center">
                              {renderBetStatus(bet.status || "pending")}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => showBetDetails(bet)}
                                  >
                                    Chi tiết
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Chi Tiết Vé Cược #{bet.id}</DialogTitle>
                                    <DialogDescription>
                                      Thông tin chi tiết về vé cược và kết quả trúng thưởng
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-gray-700">Trạng thái:</span>
                                      {renderBetStatus(bet.status || "pending")}
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">Loại cược</p>
                                        <p className="font-medium">{bet.betType}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Thời gian đặt</p>
                                        <p className="font-medium">{new Date(bet.createdAt).toLocaleString('vi-VN')}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Số tiền cược</p>
                                        <p className="font-medium text-red-500">{bet.amount.toLocaleString()}đ</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Tiền thắng</p>
                                        <p className="font-medium text-green-500">
                                          {bet.winAmount ? bet.winAmount.toLocaleString() + "đ" : "0đ"}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                      <p className="text-sm text-gray-500 mb-2">Số đã chọn</p>
                                      <div className="flex flex-wrap gap-2">
                                        {bet.numbers.map((num: string, idx: number) => (
                                          <div 
                                            key={idx} 
                                            className={`
                                              px-3 py-1 rounded-full font-mono font-medium
                                              ${bet.matchedNumbers?.includes(num) 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-gray-100 text-gray-800"}
                                            `}
                                          >
                                            {num}
                                            {bet.matchedNumbers?.includes(num) && 
                                              <CheckCheckIcon className="inline ml-1 h-3 w-3" />
                                            }
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {bet.status === "won" && (
                                      <>
                                        <Separator />
                                        <div>
                                          <p className="text-sm text-gray-500 mb-2">Số trúng thưởng</p>
                                          <div className="flex flex-wrap gap-2">
                                            {bet.matchedNumbers?.map((num: string, idx: number) => (
                                              <div 
                                                key={idx} 
                                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-mono font-medium"
                                              >
                                                {num}
                                                <CheckCheckIcon className="inline ml-1 h-3 w-3" />
                                              </div>
                                            ))}
                                          </div>
                                          
                                          <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-md">
                                            <p className="text-green-800 font-medium">
                                              Chúc mừng! Bạn đã trúng {bet.winAmount?.toLocaleString()}đ
                                            </p>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    
                                    {bet.status === "lost" && (
                                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-md">
                                        <p className="text-gray-800">
                                          Rất tiếc, vé số này không trúng thưởng. Chúc bạn may mắn lần sau!
                                        </p>
                                      </div>
                                    )}
                                    
                                    {bet.status === "pending" && (
                                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex items-center">
                                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                                        <p className="text-yellow-800">
                                          Vé số này đang chờ kết quả xổ số. Kết quả sẽ được cập nhật sau 18:30.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không có vé cược nào để hiển thị.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
