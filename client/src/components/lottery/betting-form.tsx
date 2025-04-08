import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface BettingFormProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  betType: string;
  setBetType: (type: string) => void;
  onPlaceBet: () => void;
  isSubmitting: boolean;
  balance: number;
}

export default function BettingForm({
  betAmount,
  setBetAmount,
  betType,
  setBetType,
  onPlaceBet,
  isSubmitting,
  balance
}: BettingFormProps) {
  const predefinedAmounts = [10000, 20000, 50000, 100000, 200000];

  const handleAmountSelection = (amount: number) => {
    setBetAmount(amount);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setBetAmount(value ? parseInt(value) : 0);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="font-bold text-lg mb-3">Đặt Cược</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Số Tiền Cược (VNĐ)</label>
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
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Loại Cược</label>
        <Select value={betType} onValueChange={setBetType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loại cược" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lô 2 số (Chuẩn)">Lô 2 số (Chuẩn)</SelectItem>
            <SelectItem value="Lô 3 số (Xiên 3)">Lô 3 số (Xiên 3)</SelectItem>
            <SelectItem value="Đề đầu">Đề đầu</SelectItem>
            <SelectItem value="Đề đặc biệt">Đề đặc biệt</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-gray-700">Tổng tiền:</span>
          <span className="font-mono font-bold text-lg ml-2">{betAmount.toLocaleString()} VNĐ</span>
        </div>
        <Button 
          onClick={onPlaceBet} 
          disabled={isSubmitting || betAmount <= 0 || betAmount > balance}
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
        <p className="text-red-500 text-sm mt-2">
          Số dư không đủ. Vui lòng nạp thêm tiền hoặc giảm số tiền cược.
        </p>
      )}
    </div>
  );
}
