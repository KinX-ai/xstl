import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  SettingsIcon, 
  UsersIcon, 
  DollarSignIcon, 
  PercentIcon, 
  ShieldIcon,
  RefreshCwIcon,
  SaveIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { 
  processTransaction,
  getPendingTransactions,
  getAdminUsers,
  getPendingBets,
  processPrizes,
  processAdminBalance
} from "@/lib/lottery-api";

// Định nghĩa tỷ lệ trả thưởng cho các loại giải
const DEFAULT_PRIZE_RATES = {
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
  xienhai: 15,    // Xiên 2: 1 cặp trúng x 15đ
  xienba: 40,     // Xiên 3: 1 bộ 3 trúng x 40đ
  xienbon: 100,   // Xiên 4: 1 bộ 4 trúng x 100đ
};

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [rateSettings, setRateSettings] = useState({ ...DEFAULT_PRIZE_RATES });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("rates");
  
  // States cho quản lý nạp/rút tiền
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<string>("deposit");
  const [transactionDetails, setTransactionDetails] = useState<string>("");
  
  // Kiểm tra xem người dùng có phải là admin không
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        title: "Truy cập bị từ chối",
        description: "Bạn không có quyền truy cập trang quản trị",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, setLocation, toast]);
  
  // Lấy danh sách người dùng
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      try {
        return await getAdminUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    enabled: !!user && user.role === "admin",
  });
  
  // Lấy danh sách cược đang chờ xử lý
  const { data: pendingBets, isLoading: isLoadingPendingBets } = useQuery({
    queryKey: ["/api/admin/pending-bets"],
    queryFn: async () => {
      try {
        return await getPendingBets();
      } catch (error) {
        console.error("Error fetching pending bets:", error);
        return [];
      }
    },
    enabled: !!user && user.role === "admin",
  });
  
  // Lấy danh sách giao dịch đang chờ xử lý (nạp/rút tiền)
  const { data: pendingTransactions, isLoading: isLoadingPendingTransactions } = useQuery({
    queryKey: ["/api/admin/pending-transactions"],
    queryFn: async () => {
      try {
        return await getPendingTransactions();
      } catch (error) {
        console.error("Error fetching pending transactions:", error);
        return [];
      }
    },
    enabled: !!user && user.role === "admin",
  });
  
  // Lấy cài đặt tỷ lệ trả thưởng hiện tại
  const { data: currentRates, isLoading: isLoadingRates } = useQuery({
    queryKey: ["/api/admin/prize-rates"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/prize-rates");
        return await response.json();
      } catch (error) {
        console.error("Error fetching prize rates:", error);
        return DEFAULT_PRIZE_RATES;
      }
    },
    enabled: !!user && user.role === "admin",
  });
  
  // Cập nhật tỷ lệ trả thưởng
  useEffect(() => {
    if (currentRates) {
      setRateSettings(currentRates);
    }
  }, [currentRates]);
  
  // Mutation để lưu cài đặt tỷ lệ trả thưởng
  const saveRatesMutation = useMutation({
    mutationFn: async (rates: typeof DEFAULT_PRIZE_RATES) => {
      const response = await apiRequest("POST", "/api/admin/prize-rates", rates);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lưu thành công",
        description: "Cài đặt tỷ lệ trả thưởng đã được cập nhật",
      });
      // Invalidate tất cả các queries liên quan đến prize rates để các component khác được cập nhật
      queryClient.invalidateQueries({ queryKey: ["/api/admin/prize-rates"] });
      
      // Sau khi cập nhật prize rates, chờ một chút để đảm bảo dữ liệu được lưu
      // sau đó khởi động lại các queries để cập nhật dữ liệu trên toàn bộ trang
      setTimeout(() => {
        // Cập nhật lại các trang có sử dụng prize rates
        queryClient.refetchQueries({ queryKey: ["/api/admin/prize-rates"] });
      }, 300);
    },
    onError: (error) => {
      toast({
        title: "Lưu thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu cài đặt",
        variant: "destructive",
      });
    }
  });
  
  // Mutation để tạo kết quả xổ số mới
  const generateResultsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/generate-results");
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tạo kết quả thành công",
        description: "Kết quả xổ số mới đã được tạo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lottery/results/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-bets"] });
    },
    onError: (error) => {
      toast({
        title: "Tạo kết quả thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo kết quả",
        variant: "destructive",
      });
    }
  });
  
  // Mutation để xử lý trả thưởng
  const processPrizesMutation = useMutation({
    mutationFn: async () => {
      return await processPrizes();
    },
    onSuccess: (data) => {
      toast({
        title: "Xử lý trả thưởng thành công",
        description: `Đã xử lý ${data.processed || 0} vé cược và trả thưởng ${data.winAmount?.toLocaleString() || 0}đ`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-bets"] });
    },
    onError: (error) => {
      toast({
        title: "Xử lý trả thưởng thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý trả thưởng",
        variant: "destructive",
      });
    }
  });
  
  // Mutation để xử lý yêu cầu nạp/rút tiền cụ thể
  const processTransactionMutation = useMutation({
    mutationFn: async (transactionId: number) => {
      // Sử dụng API helper function từ lottery-api.ts
      return await processTransaction(transactionId);
    },
    onSuccess: () => {
      toast({
        title: "Xử lý giao dịch thành công",
        description: "Yêu cầu nạp/rút tiền đã được xử lý thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error) => {
      toast({
        title: "Xử lý giao dịch thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý giao dịch",
        variant: "destructive",
      });
    }
  });
  
  // Mutation để xử lý nạp/rút tiền
  const processBalanceMutation = useMutation({
    mutationFn: async (data: { userId: number, amount: number, type: string, details?: string }) => {
      return await processAdminBalance(data);
    },
    onSuccess: () => {
      toast({
        title: "Giao dịch thành công",
        description: transactionType === "deposit" 
          ? `Đã nạp ${transactionAmount.toLocaleString()}đ vào tài khoản người dùng` 
          : `Đã rút ${transactionAmount.toLocaleString()}đ từ tài khoản người dùng`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      
      // Reset form
      setTransactionAmount(0);
      setTransactionDetails("");
      setSelectedUserId(null);
    },
    onError: (error) => {
      toast({
        title: "Giao dịch thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý giao dịch",
        variant: "destructive",
      });
    }
  });
  
  // Cập nhật giá trị tỷ lệ trả thưởng
  const handleRateChange = (key: keyof typeof DEFAULT_PRIZE_RATES, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setRateSettings({
        ...rateSettings,
        [key]: numValue
      });
    }
  };
  
  // Lưu cài đặt tỷ lệ trả thưởng
  const handleSaveRates = () => {
    saveRatesMutation.mutate(rateSettings);
  };
  
  // Tạo kết quả xổ số mới
  const handleGenerateResults = () => {
    if (window.confirm("Bạn có chắc chắn muốn tạo kết quả xổ số mới không?")) {
      generateResultsMutation.mutate();
    }
  };
  
  // Xử lý trả thưởng
  const handleProcessPrizes = () => {
    if (window.confirm("Bạn có chắc chắn muốn xử lý trả thưởng cho các vé cược không?")) {
      processPrizesMutation.mutate();
    }
  };
  
  // Nếu không phải admin thì không hiển thị gì
  if (!user || user.role !== "admin") {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <ShieldIcon className="mr-3 text-primary h-8 w-8" /> Trang Quản Trị
          </h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-primary border-primary px-3 py-1">
              Admin
            </Badge>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="rates">Tỷ Lệ Trả Thưởng</TabsTrigger>
            <TabsTrigger value="pending">Xử Lý Trả Thưởng</TabsTrigger>
            <TabsTrigger value="users">Quản Lý Người Dùng</TabsTrigger>
            <TabsTrigger value="transactions">Nạp/Rút Tiền</TabsTrigger>
          </TabsList>
          
          {/* Tab Quản lý tỷ lệ trả thưởng */}
          <TabsContent value="rates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PercentIcon className="mr-2 h-5 w-5" /> Cài Đặt Tỷ Lệ Trả Thưởng
                </CardTitle>
                <CardDescription>
                  Thiết lập tỷ lệ trả thưởng cho các loại giải thưởng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRates ? (
                  <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Đánh Đề</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="special">Đề đặc biệt (x1.000đ)</Label>
                          <Input
                            id="special"
                            type="number"
                            value={rateSettings.special}
                            onChange={(e) => handleRateChange('special', e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Tỷ lệ trả thưởng cho mỗi 1.000đ đặt cược</p>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="first">Đề giải nhất (x1.000đ)</Label>
                          <Input
                            id="first"
                            type="number"
                            value={rateSettings.first}
                            onChange={(e) => handleRateChange('first', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="second">Đề giải nhì (x1.000đ)</Label>
                          <Input
                            id="second"
                            type="number"
                            value={rateSettings.second}
                            onChange={(e) => handleRateChange('second', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="third">Đề giải ba (x1.000đ)</Label>
                          <Input
                            id="third"
                            type="number"
                            value={rateSettings.third}
                            onChange={(e) => handleRateChange('third', e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Đánh Lô</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="lo2so">Lô 2 số (x1.000đ)</Label>
                            <Input
                              id="lo2so"
                              type="number"
                              value={rateSettings.lo2so}
                              onChange={(e) => handleRateChange('lo2so', e.target.value)}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="lo3so">Lô 3 số (x1.000đ)</Label>
                            <Input
                              id="lo3so"
                              type="number"
                              value={rateSettings.lo3so}
                              onChange={(e) => handleRateChange('lo3so', e.target.value)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Đánh Xiên</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="xienhai">Xiên 2 (x1.000đ)</Label>
                            <Input
                              id="xienhai"
                              type="number"
                              value={rateSettings.xienhai}
                              onChange={(e) => handleRateChange('xienhai', e.target.value)}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="xienba">Xiên 3 (x1.000đ)</Label>
                            <Input
                              id="xienba"
                              type="number"
                              value={rateSettings.xienba}
                              onChange={(e) => handleRateChange('xienba', e.target.value)}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="xienbon">Xiên 4 (x1.000đ)</Label>
                            <Input
                              id="xienbon"
                              type="number"
                              value={rateSettings.xienbon}
                              onChange={(e) => handleRateChange('xienbon', e.target.value)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setRateSettings({ ...DEFAULT_PRIZE_RATES })}>
                  Đặt lại
                </Button>
                <Button 
                  onClick={handleSaveRates} 
                  disabled={saveRatesMutation.isPending}
                >
                  {saveRatesMutation.isPending ? (
                    <>
                      <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" /> Lưu Cài Đặt
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab Xử lý trả thưởng */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSignIcon className="mr-2 h-5 w-5" /> Xử Lý Trả Thưởng
                </CardTitle>
                <CardDescription>
                  Quản lý kết quả xổ số và xử lý trả thưởng cho người chơi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tạo Kết Quả Xổ Số</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Tạo kết quả xổ số mới cho ngày hôm nay. Hệ thống sẽ tạo ngẫu nhiên các số trúng thưởng.
                    </p>
                    <Button 
                      onClick={handleGenerateResults}
                      disabled={generateResultsMutation.isPending}
                    >
                      {generateResultsMutation.isPending ? (
                        <>
                          <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
                        </>
                      ) : (
                        <>
                          <RefreshCwIcon className="mr-2 h-4 w-4" /> Tạo Kết Quả
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Xử Lý Trả Thưởng</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Xử lý tự động việc trả thưởng cho các vé cược dựa trên kết quả xổ số mới nhất.
                    </p>
                    <Button 
                      onClick={handleProcessPrizes}
                      disabled={processPrizesMutation.isPending}
                    >
                      {processPrizesMutation.isPending ? (
                        <>
                          <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                        </>
                      ) : (
                        <>
                          <DollarSignIcon className="mr-2 h-4 w-4" /> Trả Thưởng
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Vé Cược Đang Chờ Xử Lý</h3>
                  {isLoadingPendingBets ? (
                    <div className="flex justify-center items-center p-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : pendingBets && pendingBets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Người dùng</TableHead>
                            <TableHead>Loại cược</TableHead>
                            <TableHead>Số đã chọn</TableHead>
                            <TableHead className="text-right">Tiền cược</TableHead>
                            <TableHead>Ngày đặt</TableHead>
                            <TableHead>Trạng thái</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingBets.map((bet: any) => (
                            <TableRow key={bet.id}>
                              <TableCell>{bet.id}</TableCell>
                              <TableCell>{bet.username}</TableCell>
                              <TableCell>{bet.betType}</TableCell>
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
                              <TableCell>{new Date(bet.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                                  Đang chờ
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Không có vé cược nào đang chờ xử lý.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Quản lý người dùng */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UsersIcon className="mr-2 h-5 w-5" /> Quản Lý Người Dùng
                </CardTitle>
                <CardDescription>
                  Quản lý thông tin và tài khoản người dùng trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="space-y-6">
                    
                    {/* Danh sách người dùng */}
                    <div className="overflow-x-auto">
                      <h3 className="text-lg font-medium mb-4">Danh Sách Người Dùng</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tên người dùng</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead className="text-right">Số dư</TableHead>
                            <TableHead>Trạng thái</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user: any) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "destructive" : "outline"}>
                                  {user.role === "admin" ? "Admin" : "Người dùng"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono font-medium">
                                {user.balance?.toLocaleString()}đ
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  Đang hoạt động
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không có người dùng nào trong hệ thống.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Nạp/Rút tiền */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSignIcon className="mr-2 h-5 w-5" /> Quản Lý Nạp/Rút Tiền
                </CardTitle>
                <CardDescription>
                  Xử lý các yêu cầu nạp tiền và rút tiền của người dùng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Form nạp/rút tiền */}
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Nạp/Rút Tiền Cho Người Dùng</CardTitle>
                      <CardDescription>
                        Thực hiện giao dịch nạp hoặc rút tiền cho người dùng
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="grid gap-2">
                          <Label htmlFor="user-select">Chọn người dùng</Label>
                          <select 
                            id="user-select"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                            value={selectedUserId || ""}
                            onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                          >
                            <option value="">Chọn người dùng...</option>
                            {users?.map((user: any) => (
                              <option key={user.id} value={user.id}>
                                {user.username} (ID: {user.id}) - Số dư: {user.balance?.toLocaleString()}đ
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="transaction-type">Loại giao dịch</Label>
                          <select 
                            id="transaction-type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                          >
                            <option value="deposit">Nạp tiền (Thêm vào số dư)</option>
                            <option value="withdraw">Rút tiền (Trừ vào số dư)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Số tiền</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="50000"
                            min="0"
                            value={transactionAmount || ""}
                            onChange={(e) => setTransactionAmount(parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="details">Ghi chú</Label>
                          <Input
                            id="details"
                            placeholder="Chi tiết giao dịch..."
                            value={transactionDetails}
                            onChange={(e) => setTransactionDetails(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-2"
                        onClick={() => {
                          if (!selectedUserId) {
                            toast({ title: "Lỗi", description: "Vui lòng chọn người dùng", variant: "destructive" });
                            return;
                          }
                          if (!transactionAmount || transactionAmount <= 0) {
                            toast({ title: "Lỗi", description: "Vui lòng nhập số tiền hợp lệ", variant: "destructive" });
                            return;
                          }
                          processBalanceMutation.mutate({
                            userId: selectedUserId,
                            amount: transactionAmount,
                            type: transactionType,
                            details: transactionDetails || undefined
                          });
                        }}
                        disabled={processBalanceMutation.isPending || !selectedUserId}
                      >
                        {processBalanceMutation.isPending ? (
                          <>
                            <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                          </>
                        ) : (
                          <>
                            <DollarSignIcon className="mr-2 h-4 w-4" /> 
                            {transactionType === "deposit" ? "Nạp Tiền" : "Rút Tiền"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Yêu cầu nạp/rút tiền đang chờ */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Yêu Cầu Nạp/Rút Tiền Đang Chờ</h3>
                    {isLoadingPendingTransactions ? (
                      <div className="flex justify-center items-center p-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : pendingTransactions && pendingTransactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Người dùng</TableHead>
                              <TableHead>Loại giao dịch</TableHead>
                              <TableHead className="text-right">Số tiền</TableHead>
                              <TableHead>Chi tiết</TableHead>
                              <TableHead>Ngày tạo</TableHead>
                              <TableHead>Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingTransactions.map((transaction: any) => (
                              <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.username}</TableCell>
                                <TableCell>
                                  <Badge variant={transaction.type === "deposit" ? "secondary" : "outline"}>
                                    {transaction.type === "deposit" ? "Nạp tiền" : "Rút tiền"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono font-medium">
                                  {transaction.amount.toLocaleString()}đ
                                </TableCell>
                                <TableCell>{transaction.details || "-"}</TableCell>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => {
                                        processTransactionMutation.mutate(transaction.id);
                                      }}
                                      disabled={processTransactionMutation.isPending}
                                    >
                                      {processTransactionMutation.isPending ? (
                                        <RefreshCwIcon className="h-4 w-4 animate-spin" />
                                      ) : "Duyệt"}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Không có yêu cầu nạp/rút tiền nào đang chờ xử lý.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}