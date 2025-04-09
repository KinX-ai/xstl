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
import { PRIZE_RATES, DEFAULT_LO_AMOUNT, fetchPrizeRates } from "@/lib/lottery-api";
import { useQuery } from "@tanstack/react-query";

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
  betMode?: string;
  setBetMode?: (mode: string) => void;
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
  onRandomSelect,
  betMode = "de",
  setBetMode
}: BettingFormProps) {
  const [internalBetMode, setInternalBetMode] = useState<"de" | "lo" | "xien" | "bacanh">(betMode as "de" | "lo" | "xien" | "bacanh");

  // Use internal or external state based on prop presence
  const actualBetMode = betMode || internalBetMode;
  const actualSetBetMode = (mode: string) => {
    if (setBetMode) {
      setBetMode(mode);
    } else {
      setInternalBetMode(mode as "de" | "lo" | "xien" | "bacanh");
    }
  };
  const [xienCount, setXienCount] = useState<number>(2);
  const [tempNumbers, setTempNumbers] = useState<string[]>([]);
  const [potentialWinnings, setPotentialWinnings] = useState<number>(0);

  // Fetch prize rates from admin config
  const { data: prizeRates } = useQuery({
    queryKey: ["/api/admin/prize-rates"],
    queryFn: async () => {
      const response = await fetch("/api/admin/prize-rates");
      if (!response.ok) throw new Error("Failed to fetch prize rates");
      return response.json();
    }
  });


  const predefinedAmounts = [10000, 20000, 50000, 100000, 200000];

  useEffect(() => {
    // Tính tiền thắng dự kiến dựa trên loại cược và số tiền đặt
    let rate = 0;
    if (actualBetMode === "de") {
      rate = betType === "Đề đặc biệt" ? prizeRates?.special : prizeRates?.first;
    } else if (actualBetMode === "lo") {
      rate = betType === "Lô 3 số" ? prizeRates?.lo3so : prizeRates?.lo2so;
    } else if (actualBetMode === "xien") {
      switch (xienCount) {
        case 2: rate = prizeRates?.xienhai; break;
        case 3: rate = prizeRates?.xienba; break;
        case 4: rate = prizeRates?.xienbon; break;
      }
    } else if (actualBetMode === "bacanh") {
      rate = prizeRates?.bacanh;
    }

    // Lô được tính theo số điểm (1 điểm = 24.000đ)
    if (actualBetMode === "lo") {
      const numPoints = betAmount / DEFAULT_LO_AMOUNT;
      // Đối với lô, mỗi số được tính riêng
      const numSelectedNumbers = selectedNumbers.length || 1;
      setPotentialWinnings(numPoints * (rate || 0) * DEFAULT_LO_AMOUNT); // Tiền thắng của 1 số
    } else if (actualBetMode === "de") {
      // Đối với đề, tổng tiền cược sẽ là số lượng số * số tiền đặt
      const numSelectedNumbers = selectedNumbers.length || 1;
      setPotentialWinnings((betAmount / numSelectedNumbers) * (rate || 0)); // Tiền thắng của 1 số
    } else if (actualBetMode === "bacanh") {
      // Ba càng tính giống như đề
      const numSelectedNumbers = selectedNumbers.length || 1;
      setPotentialWinnings((betAmount / numSelectedNumbers) * (rate || 0));
    } else {
      // Xiên
      setPotentialWinnings(betAmount * (rate || 0));
    }
  }, [betAmount, actualBetMode, betType, xienCount, selectedNumbers.length, prizeRates]);

  // Cập nhật loại cược khi người dùng chọn chế độ
  useEffect(() => {
    switch (actualBetMode) {
      case "de":
        setBetType("special");
        break;
      case "lo":
        setBetType("lo2so");
        break;
      case "xien":
        setBetType(`xien${xienCount}`);
        break;
      case "bacanh":
        setBetType("bacanh");
        break;
      default:
        setBetType("special");
    }
  }, [actualBetMode, xienCount, setBetType]);

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
    if (actualBetMode === "de") {
      return (
        <div className="space-y-3">
          <Label className="text-base">Chọn loại đề:</Label>
          <Select value={betType} onValueChange={setBetType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="special">Đề đặc biệt (x{(prizeRates?.special || 80000) / 1000})</SelectItem>
              <SelectItem value="first">Đề giải nhất (x{(prizeRates?.first || 25000) / 1000})</SelectItem>
              <SelectItem value="second">Đề giải nhì (x{(prizeRates?.second || 10000) / 1000})</SelectItem>
              <SelectItem value="third">Đề giải ba (x{(prizeRates?.third || 5000) / 1000})</SelectItem>
              <SelectItem value="fourth">Đề giải tư (x{(prizeRates?.fourth || 1200) / 1000})</SelectItem>
              <SelectItem value="fifth">Đề giải năm (x{(prizeRates?.fifth || 600) / 1000})</SelectItem>
              <SelectItem value="sixth">Đề giải sáu (x{(prizeRates?.sixth || 400) / 1000})</SelectItem>
              <SelectItem value="seventh">Đề giải bảy (x{(prizeRates?.seventh || 200) / 1000})</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-2 text-sm text-gray-600">
            <p>• <strong>Đề đặc biệt:</strong> Đánh trúng 2 số cuối của giải đặc biệt</p>
            <p>• <strong>Đề đầu:</strong> Đánh trúng 2 số đầu của giải đặc biệt</p>
            <p>• <strong>Đề đuôi:</strong> Đánh trúng 2 số cuối của giải nhất</p>
          </div>
        </div>
      );
    } else if (actualBetMode === "lo") {
      return (
        <div className="space-y-3">
          <Label className="text-base">Chọn loại lô:</Label>
          <Select value={betType} onValueChange={setBetType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại lô" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lô 2 số">Lô 2 số (x{prizeRates?.lo2so || 70})</SelectItem>
              <SelectItem value="Lô 3 số">Lô 3 số (x{prizeRates?.lo3so || 70})</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-2 text-sm text-gray-600">
            <p>• <strong>Lô 2 số:</strong> Đánh 2 số cuối, xuất hiện ở bất kỳ giải nào</p>
            <p>• <strong>Lô 3 số:</strong> Đánh 3 số cuối, xuất hiện ở bất kỳ giải nào</p>
          </div>
        </div>
      );
    } else if (actualBetMode === "xien") {
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
                Xiên {count} (x{count === 2 ? prizeRates?.xienhai || 15 : count === 3 ? prizeRates?.xienba || 40 : prizeRates?.xienbon || 100})
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
    } else if (actualBetMode === "bacanh") {
      return (
        <div className="space-y-3">
          <Label className="text-base">Ba càng (3 số cuối giải ĐB):</Label>

          <div className="mt-2 text-sm text-gray-600">
            <p>• <strong>Ba càng:</strong> Đánh trúng 3 số cuối của giải đặc biệt</p>
            <p className="mt-1 text-xs">Tỷ lệ trả thưởng: {(prizeRates?.bacanh || 880000) / 1000}x</p>
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
        <Tabs value={actualBetMode} onValueChange={(value) => actualSetBetMode(value as "de" | "lo" | "xien" | "bacanh")}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="de">Đánh Đề</TabsTrigger>
            <TabsTrigger value="lo">Đánh Lô</TabsTrigger>
            <TabsTrigger value="xien">Đánh Xiên</TabsTrigger>
            <TabsTrigger value="bacanh">Ba Càng</TabsTrigger>
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

          <TabsContent value="bacanh" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base">Ba càng (3 số cuối giải ĐB):</Label>

              <div className="mt-2 text-sm text-gray-600">
                <p>• <strong>Ba càng:</strong> Đánh trúng 3 số cuối của giải đặc biệt</p>
                <p className="mt-1 text-xs">Tỷ lệ trả thưởng: {(prizeRates?.bacanh || 880000) / 1000}x</p>
              </div>
            </div>
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
              maxLength={actualBetMode === "lo" && betType === "Lô 3 số" || actualBetMode === "bacanh" ? 3 : 2}
            />
            <Button variant="outline" onClick={onClearAll} title="Xóa tất cả">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onRandomSelect} title="Chọn ngẫu nhiên">
              <RefreshCcwDot className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {actualBetMode === "de" && "Bạn có thể chọn nhiều số đề khác nhau"}
            {actualBetMode === "lo" && betType === "Lô 2 số" && (
              <>
                <p>Bạn có thể chọn nhiều số lô 2 chữ số khác nhau</p>
                <p className="mt-1 text-xs">1 điểm = {DEFAULT_LO_AMOUNT.toLocaleString()} VNĐ, trả thưởng {prizeRates?.lo2so || 70}x</p>
              </>
            )}
            {actualBetMode === "lo" && betType === "Lô 3 số" && (
              <>
                <p>Bạn có thể chọn nhiều số lô 3 chữ số khác nhau</p>
                <p className="mt-1 text-xs">1 điểm = {DEFAULT_LO_AMOUNT.toLocaleString()} VNĐ, trả thưởng {prizeRates?.lo3so || 70}x</p>
              </>
            )}
            {actualBetMode === "xien" && (
              <>
                <p>Bạn cần chọn đúng {xienCount} số cho xiên {xienCount}</p>
                <p className="mt-1 text-xs">Tỷ lệ trả thưởng: {betType === "Xiên 2" ? prizeRates?.xienhai || 15 : betType === "Xiên 3" ? prizeRates?.xienba || 40 : prizeRates?.xienbon || 100}x</p>
              </>
            )}
            {actualBetMode === "bacanh" && (
              <>
                <p>Bạn cần chọn số có 3 chữ số cho Ba càng</p>
                <p className="mt-1 text-xs">Tỷ lệ trả thưởng: {(prizeRates?.bacanh || 880000) / 1000}x</p>
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
              {actualBetMode === "lo" ? (
                <>
                  {(betAmount * selectedNumbers.length).toLocaleString()} VNĐ 
                  {selectedNumbers.length > 1 && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({(betAmount / DEFAULT_LO_AMOUNT).toFixed(2)} điểm x {selectedNumbers.length} số)
                    </span>
                  )}
                </>
              ) : actualBetMode === "de" ? (
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
              (actualBetMode === "xien" && selectedNumbers.length !== xienCount) ||
              (actualBetMode === "bacanh" && selectedNumbers.some(num => num.length !== 3))
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

        {actualBetMode === "xien" && selectedNumbers.length !== xienCount && (
          <p className="text-amber-500 text-sm">
            Cần chọn đúng {xienCount} số để đánh xiên {xienCount}. Hiện tại bạn đã chọn {selectedNumbers.length} số.
          </p>
        )}

        {actualBetMode === "bacanh" && selectedNumbers.some(num => num.length !== 3) && (
          <p className="text-amber-500 text-sm">
            Đối với Ba càng, mỗi số phải có 3 chữ số.
          </p>
        )}

        <div className="text-xs text-gray-500 text-center w-full pt-2 border-t mt-2">
          Lưu ý: Kết quả xổ số được cập nhật lúc 18:30 hàng ngày. Tiền thắng sẽ được cộng vào tài khoản sau khi có kết quả.
        </div>
      </CardFooter>
    </Card>
  );
}