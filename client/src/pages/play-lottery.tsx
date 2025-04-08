import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamepadIcon, RefreshCwIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberGrid from "@/components/lottery/number-grid";
import BettingForm from "@/components/lottery/betting-form";
import { useMutation } from "@tanstack/react-query";
import { placeBet } from "@/lib/lottery-api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function PlayLottery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10000);
  const [betType, setBetType] = useState<string>("Lô 2 số (Chuẩn)");

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
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <GamepadIcon className="mr-3 text-primary h-8 w-8" /> Chơi Xổ Số Ngay
        </h1>

        <Card className="mb-8">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <GamepadIcon className="mr-2 h-5 w-5" /> Chọn Số May Mắn
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-3">Chọn Số May Mắn</h3>
              <p className="text-gray-600 mb-4">
                Chọn số từ 00-99 để tham gia dự thưởng. Bạn có thể chọn nhiều số khác nhau.
              </p>
              
              {/* Number Selection Grid */}
              <div className="mb-6">
                <NumberGrid 
                  selectedNumbers={selectedNumbers}
                  onNumberSelect={handleNumberSelection}
                />
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2" 
                    onClick={handleRandomSelection}
                  >
                    <RefreshCwIcon className="mr-2 h-4 w-4" /> Số Ngẫu Nhiên
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClearSelection}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" /> Xóa Tất Cả
                  </Button>
                </div>
              </div>
              
              {/* Betting Form */}
              <BettingForm 
                betAmount={betAmount} 
                setBetAmount={setBetAmount}
                betType={betType}
                setBetType={setBetType}
                onPlaceBet={handlePlaceBet}
                isSubmitting={betMutation.isPending}
                balance={user?.balance || 0}
              />
              
              {/* Selected Numbers Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                <h3 className="font-bold text-lg mb-3">Số Đã Chọn</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedNumbers.length > 0 ? (
                    selectedNumbers.map(num => (
                      <div key={num} className="bg-primary text-white rounded-lg px-4 py-2 flex items-center font-mono">
                        <span className="mr-2">{num}</span>
                        <button 
                          className="text-white/70 hover:text-white"
                          onClick={() => handleNumberSelection(num)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Chưa có số nào được chọn</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
