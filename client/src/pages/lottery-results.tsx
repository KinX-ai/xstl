import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestResults, fetchResultsByDate, fetchAvailableDates, checkWinner } from "@/lib/lottery-api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, SearchIcon, ChevronLeft, ChevronRight, CalendarIcon, RefreshCw } from "lucide-react";
import ResultsTable from "@/components/lottery/results-table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format, parse, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function LotteryResults() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkNumber, setCheckNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [region, setRegion] = useState<string>("mienbac");
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [queryDate, setQueryDate] = useState<string | null>(null);
  
  // Fetch available dates
  const { data: availableDates, isLoading: isLoadingDates } = useQuery({
    queryKey: ["/api/lottery/available-dates"],
    queryFn: () => fetchAvailableDates(),
  });
  
  // Fetch latest results by default, or results for a specific date if specified
  const { data: lotteryResults, isLoading, refetch } = useQuery({
    queryKey: [queryDate ? `/api/lottery/results/date/${queryDate}` : "/api/lottery/results/latest"],
    queryFn: () => queryDate 
      ? fetchResultsByDate(queryDate) 
      : fetchLatestResults(),
  });
  
  // Set up auto-refresh for latest results during drawing time
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isAutoRefresh && !queryDate) {
      // Check if we're in the drawing period
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const isDrawingTime = (hours === 18 && minutes >= 15) || (hours === 19 && minutes < 15);
      
      if (isDrawingTime) {
        // Auto-refresh every 30 seconds during drawing time
        intervalId = setInterval(() => {
          refetch();
        }, 30000);
      }
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefresh, queryDate, refetch]);

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

        {/* Date Selection and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Chọn đài:</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn miền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mienbac">Miền Bắc</SelectItem>
                <SelectItem value="mientrung">Miền Trung</SelectItem>
                <SelectItem value="miennam">Miền Nam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Ngày:</label>
            <div className="flex">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-r-none"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-none flex-1 justify-start font-normal border-x-0"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date as Date);
                      setShowDatePicker(false);
                    }}
                    disabled={(date) => {
                      // Only enable dates that have available results
                      if (!availableDates || date > new Date()) return true;
                      const dateStr = format(date, "yyyy-MM-dd");
                      return !availableDates.includes(dateStr);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-l-none"
                disabled={selectedDate >= new Date()}
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() + 1);
                  if (newDate <= new Date()) {
                    setSelectedDate(newDate);
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-none md:self-end mt-auto flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={isAutoRefresh ? "bg-green-50 text-green-700 border-green-300" : ""}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
              {isAutoRefresh ? "Tự Động Cập Nhật" : "Bật Tự Động Cập Nhật"}
            </Button>
            
            <Button
              onClick={() => {
                if (selectedDate) {
                  const dateStr = format(selectedDate, "yyyy-MM-dd");
                  if (availableDates?.includes(dateStr)) {
                    setQueryDate(dateStr);
                  } else {
                    setQueryDate(null);
                    toast({
                      title: "Không có dữ liệu",
                      description: "Không có kết quả cho ngày đã chọn. Hiển thị kết quả mới nhất.",
                      variant: "destructive",
                    });
                  }
                }
              }}
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              Xem Kết Quả
            </Button>
          </div>
        </div>

        {/* Latest Results Section */}
        <Card className="mb-8">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" /> 
                Kết Quả Xổ Số {region === "mienbac" ? "Miền Bắc" : (region === "mientrung" ? "Miền Trung" : "Miền Nam")}
              </div>
              
              {/* Show date badge and drawing state if applicable */}
              <div className="flex items-center gap-2">
                {queryDate && (
                  <Badge variant="secondary" className="bg-white text-primary">
                    Ngày: {format(parse(queryDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}
                  </Badge>
                )}
                {lotteryResults?.drawState === "drawing" && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse">
                    Đang quay thưởng
                  </Badge>
                )}
              </div>
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
