import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { betFormSchema, BetFormData } from "@shared/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gamepad2 } from "lucide-react";

interface BettingFormProps {
  selectedNumbers: string[];
}

export default function BettingForm({ selectedNumbers }: BettingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState<string>("");
  
  const form = useForm<BetFormData>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      numbers: selectedNumbers.join(","),
      amount: 10000,
      betType: "lo2",
    },
  });

  // Update form when selectedNumbers changes
  if (form.getValues("numbers") !== selectedNumbers.join(",")) {
    form.setValue("numbers", selectedNumbers.join(","));
  }

  const betMutation = useMutation({
    mutationFn: async (data: BetFormData) => {
      const response = await apiRequest("POST", "/api/bets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Đặt cược thành công",
        description: "Vé của bạn đã được xác nhận. Chúc may mắn!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Đặt cược thất bại",
        description: error.message || "Vui lòng thử lại sau",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BetFormData) => {
    if (!user) {
      toast({
        title: "Đặt cược thất bại",
        description: "Vui lòng đăng nhập để đặt cược",
        variant: "destructive",
      });
      return;
    }

    if (selectedNumbers.length === 0) {
      toast({
        title: "Đặt cược thất bại",
        description: "Vui lòng chọn ít nhất một số",
        variant: "destructive",
      });
      return;
    }

    if (user.balance < data.amount) {
      toast({
        title: "Đặt cược thất bại",
        description: "Số dư không đủ. Vui lòng nạp thêm tiền.",
        variant: "destructive",
      });
      return;
    }

    betMutation.mutate(data);
  };

  const handleAmountClick = (amount: number) => {
    form.setValue("amount", amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      const numValue = parseFloat(value.replace(/,/g, ""));
      if (!isNaN(numValue)) {
        form.setValue("amount", numValue);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="bg-primary text-white pb-3">
        <CardTitle className="flex items-center text-2xl">
          <Gamepad2 className="mr-2 h-5 w-5" /> Đặt Cược
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="betType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại Cược</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại cược" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lo2">Lô 2 số (Chuẩn)</SelectItem>
                      <SelectItem value="lo3">Lô 3 số (Xiên 3)</SelectItem>
                      <SelectItem value="de_dau">Đề đầu</SelectItem>
                      <SelectItem value="de_db">Đề đặc biệt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Số Tiền Cược (VNĐ)</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {[10000, 20000, 50000, 100000, 200000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={form.getValues("amount") === amount ? "default" : "outline"}
                    onClick={() => handleAmountClick(amount)}
                    className="py-2 px-4 font-mono"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
                <div className="relative flex-grow">
                  <Input
                    placeholder="Số khác"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    VNĐ
                  </span>
                </div>
              </div>
              {form.formState.errors.amount && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Tổng tiền:</span>
                <span className="font-mono font-bold text-lg ml-2">
                  {formatCurrency(form.getValues("amount"))} VNĐ
                </span>
              </div>
              <Button
                type="submit"
                disabled={betMutation.isPending || selectedNumbers.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                {betMutation.isPending ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Đặt Cược
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
