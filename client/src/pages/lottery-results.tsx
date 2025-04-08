import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestResults, checkWinner } from "@/lib/lottery-api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, SearchIcon } from "lucide-react";
import ResultsTable from "@/components/lottery/results-table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LotteryResults() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkNumber, setCheckNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  
  const { data: lotteryResults, isLoading } = useQuery({
    queryKey: ["/api/lottery/results/latest"],
    queryFn: () => fetchLatestResults(),
  });

  const handleCheckNumber = () => {
    if (!checkNumber.trim()) {
      toast({
        title: "Vui lòng nhập số",
        description: "Hãy nhập số cần kiểm tra (2 số hoặc nhiều hơn)",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d+$/.test(checkNumber)) {
      toast({
        title: "Số không hợp lệ",
        description: "Vui lòng chỉ nhập các chữ số",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate processing time
    setTimeout(() => {
      if (lotteryResults) {
        const isWinner = checkWinner(checkNumber, lotteryResults);
        
        toast({
          title: isWinner ? "Chúc mừng!" : "Không trúng thưởng",
          description: isWinner 
            ? `Số ${checkNumber} của bạn đã trúng thưởng!` 
            : `Số ${checkNumber} không trúng thưởng. Hãy thử lại vào lần sau!`,
          variant: isWinner ? "default" : "destructive",
        });
      } else {
        toast({
          title: "Không thể kiểm tra",
          description: "Không thể tải kết quả xổ số để kiểm tra. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
      
      setIsChecking(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Trophy className="mr-3 text-primary h-8 w-8" /> Kết Quả Xổ Số Miền Bắc
        </h1>

        {/* Latest Results Section */}
        <Card className="mb-8">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" /> Kết Quả Xổ Số Mới Nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : lotteryResults ? (
              <ResultsTable results={lotteryResults} />
            ) : (
              <div className="text-center p-8 text-gray-500">
                Không thể tải kết quả xổ số. Vui lòng thử lại sau.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check Results Section */}
        <Card className="mb-8">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <SearchIcon className="mr-2 h-5 w-5" /> Kiểm Tra Kết Quả
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-3">Kiểm Tra Kết Quả</h3>
              <p className="text-gray-600 mb-4">
                Nhập số của bạn để kiểm tra kết quả. Hệ thống sẽ so sánh với kết quả xổ số mới nhất.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Input 
                    type="text" 
                    placeholder="Nhập số của bạn (2 số hoặc nhiều hơn)" 
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    maxLength={5}
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={handleCheckNumber} 
                  disabled={isChecking || !checkNumber.trim()}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang kiểm tra
                    </>
                  ) : (
                    "Kiểm Tra"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Archive Section */}
        <Card>
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" /> Lịch Sử Kết Quả
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center p-8">
              <p className="text-gray-600 mb-4">
                Lịch sử kết quả các kỳ quay trước sẽ được hiển thị ở đây.
              </p>
              <Button variant="outline">Xem Lịch Sử Kết Quả</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
