import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, Loader2, RefreshCcwDot, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { PRIZE_RATES as PrizeRates, DEFAULT_LO_AMOUNT as LoAmount } from "@/lib/lottery-api";

interface BettingFormProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  betType: string;
  setBetType: (type: string) => void;
  onPlaceBet: () => void;
  isSubmitting: boolean;
  balance: number;
  selectedNumbers: string[];
  onSelectNumber?: (number: string) => void;
  onClearAll?: () => void;
  onRandomSelect?: () => void;
}

// Đã import PRIZE_RATES và DEFAULT_LO_AMOUNT từ lottery-api.ts

export default function BettingForm({
  betAmount,
  setBetAmount,
  betType,
  setBetType,
  onPlaceBet,
  isSubmitting,
  balance,
  selectedNumbers,
  onSelectNumber,
  onClearAll,
  onRandomSelect
}: BettingFormProps) {
  const [betMode, setBetMode] = useState<"de" | "lo" | "xien">("de");
  const [xienCount, setXienCount] = useState<number>(2);
  const [tempNumbers, setTempNumbers] = useState<string[]>([]);
  const [potentialWinnings, setPotentialWinnings] = useState<number>(0);
  
  const predefinedAmounts = [10000, 20000, 50000, 100000, 200000];

  useEffect(() => {
    // Tính tiền thắng dự kiến dựa trên loại cược và số tiền đặt
    let rate = 0;
    if (betMode === "de") {
      rate = betType === "Đề đặc biệt" ? PrizeRates.special : PrizeRates.first;
    } else if (betMode === "lo") {
      rate = betType === "Lô 3 số" ? PrizeRates.lo3so : PrizeRates.lo2so;
    } else if (betMode === "xien") {
      switch (xienCount) {
        case 2: rate = PrizeRates.xienhai; break;
        case 3: rate = PrizeRates.xienba; break;
        case 4: rate = PrizeRates.xienbon; break;
      }
    }
    
    // Lô được tính theo số điểm (1 điểm = 24.000đ)
    if (betMode === "lo") {
      const numPoints = betAmount / LoAmount;
      // Đối với lô, mỗi số được tính riêng
      const numSelectedNumbers = selectedNumbers.length || 1;
      setPotentialWinnings(numPoints * rate * LoAmount); // Tiền thắng của 1 số
    } else if (betMode === "de") {
      // Đối với đề, tổng tiền cược sẽ là số lượng số * số tiền đặt
      const numSelectedNumbers = selectedNumbers.length || 1;
      setPotentialWinnings((betAmount / numSelectedNumbers) * rate / 1000); // Tiền thắng của 1 số
    } else {
      // Xiên
      setPotentialWinnings(betAmount * rate / 1000);
    }
  }, [betAmount, betMode, betType, xienCount, selectedNumbers.length]);

  // Cập nhật loại cược khi người dùng chọn chế độ
  useEffect(() => {
    if (betMode === "de") {
      setBetType("Đề đặc biệt");
    } else if (betMode === "lo") {
      setBetType("Lô 2 số");
    } else if (betMode === "xien") {
      setBetType(`Xiên ${xienCount}`);
    }
  }, [betMode, xienCount, setBetType]);

  const handleAmountSelection = (amount: number) => {
    setBetAmount(amount);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setBetAmount(value ? parseInt(value) : 0);
  };

  const handleXienCountChange = (count: number) => {
    setXienCount(count);
    setBetType(`Xiên ${count}`);
  };

  const addTempNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value && !tempNumbers.includes(value) && onSelectNumber) {
        onSelectNumber(value);
        setTempNumbers([...tempNumbers, value]);
        input.value = '';
      }
    }
  };

  // Tạo các mục lựa chọn cho thể loại đánh lô đề
  const renderBetTypeOptions = () => {
    if (betMode === "de") {
      return (
        <div className="space-y-3">
          <Label className="text-base">Chọn loại đề:</Label>
          <Select value={betType} onValueChange={setBetType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Đề đặc biệt">Đề đặc biệt (x{PRIZE_RATES.special})</SelectItem>
              <SelectItem value="Đề đầu">Đề đầu (x{PRIZE_RATES.first})</SelectItem>
              <SelectItem value="Đề đuôi">Đề đuôi (x{PRIZE_RATES.first})</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="mt-2 text-sm text-gray-600">
            <p>• <strong>Đề đặc biệt:</strong> Đánh trúng 2 số cuối của giải đặc biệt</p>
            <p>• <strong>Đề đầu:</strong> Đánh trúng 2 số đầu của giải đặc biệt</p>
            <p>• <strong>Đề đuôi:</strong> Đánh trúng 2 số cuối của giải nhất</p>
          </div>
        </div>
      );
    } else if (betMode === "lo") {
      return (
        <div className="space-y-3">
          <Label className="text-base">Chọn loại lô:</Label>
          <Select value={betType} onValueChange={setBetType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại lô" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lô 2 số">Lô 2 số (x{PRIZE_RATES.lo2so})</SelectItem>
              <SelectItem value="Lô 3 số">Lô 3 số (x{PRIZE_RATES.lo3so})</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="mt-2 text-sm text-gray-600">
            <p>• <strong>Lô 2 số:</strong> Đánh 2 số cuối, xuất hiện ở bất kỳ giải nào</p>
            <p>• <strong>Lô 3 số:</strong> Đánh 3 số cuối, xuất hiện ở bất kỳ giải nào</p>
          </div>
        </div>
      );
    } else if (betMode === "xien") {
      return (
        <div className="space-y-3">
          <Label className="text-base">Chọn loại xiên:</Label>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4].map((count) => (
              <Button
                key={count}
                type="button"
                variant={xienCount === count ? "default" : "outline"}
                onClick={() => handleXienCountChange(count)}
              >
                Xiên {count} (x{count === 2 ? PRIZE_RATES.xienhai : count === 3 ? PRIZE_RATES.xienba : PRIZE_RATES.xienbon})
              </Button>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            <p>• <strong>Xiên 2:</strong> Cần 2 số đều xuất hiện ở bất kỳ giải nào</p>
            <p>• <strong>Xiên 3:</strong> Cần 3 số đều xuất hiện ở bất kỳ giải nào</p>
            <p>• <strong>Xiên 4:</strong> Cần 4 số đều xuất hiện ở bất kỳ giải nào</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đặt Cược</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={betMode} onValueChange={(value) => setBetMode(value as "de" | "lo" | "xien")}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="de">Đánh Đề</TabsTrigger>
            <TabsTrigger value="lo">Đánh Lô</TabsTrigger>
            <TabsTrigger value="xien">Đánh Xiên</TabsTrigger>
          </TabsList>
          
          <TabsContent value="de" className="space-y-4">
            {renderBetTypeOptions()}
          </TabsContent>
          
          <TabsContent value="lo" className="space-y-4">
            {renderBetTypeOptions()}
          </TabsContent>
          
          <TabsContent value="xien" className="space-y-4">
            {renderBetTypeOptions()}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 mb-4">
          <Label className="text-base mb-2 block">Chọn Số:</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedNumbers.map((num) => (
              <div 
                key={num} 
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
              >
                {num}
                <button 
                  className="ml-2 text-primary/70 hover:text-primary/100"
                  onClick={() => {
                    const updated = selectedNumbers.filter(n => n !== num);
                    if (onSelectNumber) {
                      // Hack: remove by adding then clearing
                      onSelectNumber("");
                      onClearAll && onClearAll();
                      updated.forEach(n => onSelectNumber(n));
                    }
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Nhập số (Enter để thêm)"
              className="flex-grow"
              onKeyDown={addTempNumber}
              maxLength={betMode === "lo" && betType === "Lô 3 số" ? 3 : 2}
            />
            <Button variant="outline" onClick={onClearAll} title="Xóa tất cả">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onRandomSelect} title="Chọn ngẫu nhiên">
              <RefreshCcwDot className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            {betMode === "de" && "Bạn có thể chọn nhiều số đề khác nhau"}
            {betMode === "lo" && betType === "Lô 2 số" && (
              <>
                <p>Bạn có thể chọn nhiều số lô 2 chữ số khác nhau</p>
                <p className="mt-1 text-xs">1 điểm = {DEFAULT_LO_AMOUNT.toLocaleString()} VNĐ, trả thưởng {PRIZE_RATES.lo2so}x</p>
              </>
            )}
            {betMode === "lo" && betType === "Lô 3 số" && (
              <>
                <p>Bạn có thể chọn nhiều số lô 3 chữ số khác nhau</p>
                <p className="mt-1 text-xs">1 điểm = {DEFAULT_LO_AMOUNT.toLocaleString()} VNĐ, trả thưởng {PRIZE_RATES.lo3so}x</p>
              </>
            )}
            {betMode === "xien" && (
              <>
                <p>Bạn cần chọn đúng {xienCount} số cho xiên {xienCount}</p>
                <p className="mt-1 text-xs">Tỷ lệ trả thưởng: {betType === "Xiên 2" ? PRIZE_RATES.xienhai : betType === "Xiên 3" ? PRIZE_RATES.xienba : PRIZE_RATES.xienbon}x</p>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <Label className="text-base block mb-2">Số Tiền Cược (VNĐ):</Label>
          <div className="flex flex-wrap gap-2">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={betAmount === amount ? "default" : "outline"}
                onClick={() => handleAmountSelection(amount)}
                className="font-mono"
              >
                {amount.toLocaleString()}
              </Button>
            ))}
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Số khác" 
                className="w-full font-mono"
                value={!predefinedAmounts.includes(betAmount) ? betAmount.toLocaleString() : ''}
                onChange={handleCustomAmount}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">VNĐ</span>
            </div>
          </div>
        </div>
        
        {potentialWinnings > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center text-green-700 font-medium mb-1">
              <Check className="h-4 w-4 mr-1" /> Tiền thắng dự kiến:
            </div>
            <div className="font-mono text-lg font-bold text-green-800">
              {potentialWinnings.toLocaleString()} VNĐ
            </div>
            <div className="text-xs text-green-600 mt-1">
              (Nếu trúng tất cả số đã chọn)
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3">
        <div className="flex justify-between w-full items-center">
          <div>
            <span className="text-gray-700">Tổng tiền cược:</span>
            <span className="font-mono font-bold text-lg ml-2">
              {betMode === "lo" ? (
                <>
                  {(betAmount * selectedNumbers.length).toLocaleString()} VNĐ 
                  {selectedNumbers.length > 1 && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({(betAmount / DEFAULT_LO_AMOUNT).toFixed(2)} điểm x {selectedNumbers.length} số)
                    </span>
                  )}
                </>
              ) : betMode === "de" ? (
                <>
                  {(betAmount * selectedNumbers.length).toLocaleString()} VNĐ
                  {selectedNumbers.length > 1 && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({betAmount.toLocaleString()} VNĐ x {selectedNumbers.length} số)
                    </span>
                  )}
                </>
              ) : (
                <>{betAmount.toLocaleString()} VNĐ</>
              )}
            </span>
          </div>
          <Button 
            onClick={onPlaceBet} 
            disabled={
              isSubmitting || 
              betAmount <= 0 || 
              betAmount > balance || 
              selectedNumbers.length === 0 ||
              (betMode === "xien" && selectedNumbers.length !== xienCount)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý
              </>
            ) : (
              "Đặt Cược"
            )}
          </Button>
        </div>
        
        {betAmount > balance && (
          <p className="text-red-500 text-sm">
            Số dư không đủ. Vui lòng nạp thêm tiền hoặc giảm số tiền cược.
          </p>
        )}
        
        {betMode === "xien" && selectedNumbers.length !== xienCount && (
          <p className="text-amber-500 text-sm">
            Cần chọn đúng {xienCount} số để đánh xiên {xienCount}. Hiện tại bạn đã chọn {selectedNumbers.length} số.
          </p>
        )}
        
        <div className="text-xs text-gray-500 text-center w-full pt-2 border-t mt-2">
          Lưu ý: Kết quả xổ số được cập nhật lúc 18:30 hàng ngày. Tiền thắng sẽ được cộng vào tài khoản sau khi có kết quả.
        </div>
      </CardFooter>
    </Card>
  );
}
