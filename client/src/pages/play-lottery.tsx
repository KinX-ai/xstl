import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamepadIcon, LucideCoins } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NumberGrid from "@/components/lottery/number-grid";
import BettingForm from "@/components/lottery/betting-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchLatestResults, placeBet } from "@/lib/lottery-api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import ResultsTable from "@/components/lottery/results-table";

export default function PlayLottery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10000);
  const [betType, setBetType] = useState<string>("Đề đặc biệt");
  const [betMode, setBetMode] = useState<string>("de");
  const [activeTab, setActiveTab] = useState<string>("play");

  // Lấy kết quả xổ số mới nhất
  const { data: latestResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ["/api/lottery/results/latest"],
    queryFn: fetchLatestResults,
  });

  // Mutation cho đặt cược
  const betMutation = useMutation({
    mutationFn: placeBet,
    onSuccess: () => {
      toast({
        title: "Đặt cược thành công",
        description: `Đã đặt cược cho các số: ${selectedNumbers.join(", ")} với số tiền ${betAmount.toLocaleString()} VNĐ`,
      });
      
      // Reset selection
      setSelectedNumbers([]);
      
      // Refetch user data to update balance
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Đặt cược thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt cược. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  const handleNumberSelection = (number: string) => {
    if (!number) return;
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(num => num !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleRandomSelection = () => {
    // Generate 5 random numbers between 0-99
    const randomNumbers: string[] = [];
    while (randomNumbers.length < 5) {
      const num = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }
    setSelectedNumbers(randomNumbers);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handlePlaceBet = () => {
    if (selectedNumbers.length === 0) {
      toast({
        title: "Không thể đặt cược",
        description: "Vui lòng chọn ít nhất một số để đặt cược",
        variant: "destructive",
      });
      return;
    }

    if (!user || user.balance < betAmount) {
      toast({
        title: "Số dư không đủ",
        description: "Số dư của bạn không đủ để đặt cược với số tiền này",
        variant: "destructive",
      });
      return;
    }

    betMutation.mutate({
      numbers: selectedNumbers,
      amount: betAmount,
      betType: betType
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <GamepadIcon className="mr-3 text-primary h-8 w-8" /> Xổ Số Miền Bắc
          </h1>
          {user && (
            <div className="flex items-center bg-white p-2 px-4 rounded-full shadow">
              <LucideCoins className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium text-gray-700">Số dư:</span>
              <span className="font-bold text-primary ml-2">{user.balance?.toLocaleString() || 0} VNĐ</span>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="play">Đặt Cược</TabsTrigger>
            <TabsTrigger value="results">Kết Quả Xổ Số</TabsTrigger>
          </TabsList>
          
          <TabsContent value="play" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {/* Number Grid Component */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chọn Số May Mắn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Chọn số từ 00-99 để tham gia dự thưởng. Bạn có thể chọn nhiều số khác nhau.
                    </p>
                    <NumberGrid 
                      selectedNumbers={selectedNumbers}
                      onNumberSelect={handleNumberSelection}
                      mode={betMode === "bacanh" ? "bacanh" : "regular"}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                {/* Betting Form Component */}
                <BettingForm 
                  betAmount={betAmount} 
                  setBetAmount={setBetAmount}
                  betType={betType}
                  setBetType={setBetType}
                  onPlaceBet={handlePlaceBet}
                  isSubmitting={betMutation.isPending}
                  balance={user?.balance || 0}
                  selectedNumbers={selectedNumbers}
                  onSelectNumber={handleNumberSelection}
                  onClearAll={handleClearSelection}
                  onRandomSelect={handleRandomSelection}
                  betMode={betMode}
                  setBetMode={(mode) => {
                    setBetMode(mode);
                    // Clear selection when switching bet modes
                    setSelectedNumbers([]);
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {isLoadingResults ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : latestResults ? (
              <ResultsTable results={latestResults} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Không thể tải kết quả xổ số. Vui lòng thử lại sau.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2">Hướng Dẫn Cách Chơi</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Chọn loại cược (Đề, Lô, Xiên) và các thông số cụ thể</li>
            <li>Chọn các số bạn muốn đặt cược từ bảng số hoặc nhập trực tiếp</li>
            <li>Nhập số tiền cược (tối thiểu 10.000 VNĐ)</li>
            <li>Nhấn "Đặt Cược" để hoàn tất</li>
            <li>Kết quả xổ số sẽ được cập nhật lúc 18:30 hàng ngày</li>
            <li>Tiền thắng cuộc sẽ được cộng vào tài khoản ngay sau khi có kết quả</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
