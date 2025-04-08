import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createTransaction } from "@/lib/lottery-api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { UserIcon, CreditCardIcon, SettingsIcon, CircleDollarSign, BadgeIcon } from "lucide-react";
import { useState } from "react";

const depositSchema = z.object({
  amount: z.string().refine((val) => {
    const num = Number(val.replace(/,/g, ''));
    return !isNaN(num) && num > 0;
  }, "Số tiền phải lớn hơn 0"),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null);
  
  const depositForm = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: "100000",
    },
  });

  const depositMutation = useMutation({
    mutationFn: (data: { amount: number }) => {
      return createTransaction({
        type: "deposit",
        amount: data.amount,
        details: "Nạp tiền vào tài khoản",
        status: "completed",
      });
    },
    onSuccess: () => {
      toast({
        title: "Nạp tiền thành công",
        description: "Số dư của bạn đã được cập nhật",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      depositForm.reset({ amount: "" });
    },
    onError: (error) => {
      toast({
        title: "Nạp tiền thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi nạp tiền",
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number }) => {
      return createTransaction({
        type: "withdraw",
        amount: -data.amount,
        details: "Rút tiền từ tài khoản",
        status: "completed",
      });
    },
    onSuccess: () => {
      toast({
        title: "Rút tiền thành công",
        description: "Số dư của bạn đã được cập nhật",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      depositForm.reset({ amount: "" });
    },
    onError: (error) => {
      toast({
        title: "Rút tiền thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi rút tiền",
        variant: "destructive",
      });
    },
  });

  const onDepositSubmit = (values: z.infer<typeof depositSchema>) => {
    const amount = Number(values.amount.replace(/,/g, ''));
    depositMutation.mutate({ amount });
  };

  const onWithdrawSubmit = (values: z.infer<typeof depositSchema>) => {
    const amount = Number(values.amount.replace(/,/g, ''));
    if (user && amount > user.balance) {
      toast({
        title: "Số dư không đủ",
        description: "Số tiền rút không được vượt quá số dư hiện tại",
        variant: "destructive",
      });
      return;
    }
    withdrawMutation.mutate({ amount });
  };

  // Promotions data (mock)
  const promotions = [
    {
      id: 1,
      title: "Thưởng 100% cho người mới",
      description: "Nhận ngay 100% giá trị nạp đầu tiên lên đến 500.000đ khi đăng ký tài khoản mới.",
      expiry: "30/06/2023",
      isNew: true,
    },
    {
      id: 2,
      title: "Hoàn tiền 10% mỗi tuần",
      description: "Nhận lại 10% tổng tiền cược mỗi tuần, không giới hạn số tiền hoàn trả.",
      expiry: "Áp dụng hàng tuần",
      isNew: false,
    },
    {
      id: 3,
      title: "Giới thiệu bạn bè - Nhận thưởng",
      description: "Nhận ngay 50.000đ cho mỗi người bạn giới thiệu tham gia và nạp tiền.",
      expiry: "Không giới hạn",
      isNew: false,
    },
  ];

  const applyPromotion = (id: number) => {
    setSelectedPromotionId(id);
    toast({
      title: "Áp dụng khuyến mãi thành công",
      description: "Khuyến mãi đã được áp dụng cho tài khoản của bạn",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <UserIcon className="mr-3 text-primary h-8 w-8" /> Hồ Sơ Cá Nhân
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader className="bg-primary text-white">
              <CardTitle>Thông Tin Tài Khoản</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <UserIcon className="h-10 w-10 text-gray-500" />
                </div>
                <h2 className="text-xl font-bold">{user?.username}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Số dư tài khoản:</span>
                  <span className="font-mono font-bold text-lg">{user?.balance?.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Thành viên từ:</span>
                  <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="transactions">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="transactions" className="flex items-center">
                  <CreditCardIcon className="h-4 w-4 mr-2" /> Nạp/Rút tiền
                </TabsTrigger>
                <TabsTrigger value="promotions" className="flex items-center">
                  <BadgeIcon className="h-4 w-4 mr-2" /> Khuyến Mãi
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <SettingsIcon className="h-4 w-4 mr-2" /> Cài Đặt
                </TabsTrigger>
              </TabsList>
              
              {/* Transactions Tab */}
              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Nạp/Rút Tiền</CardTitle>
                    <CardDescription>
                      Nạp tiền vào tài khoản hoặc rút tiền từ tài khoản của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="deposit">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="deposit">Nạp Tiền</TabsTrigger>
                        <TabsTrigger value="withdraw">Rút Tiền</TabsTrigger>
                      </TabsList>
                      
                      {/* Deposit Form */}
                      <TabsContent value="deposit" className="pt-4">
                        <Form {...depositForm}>
                          <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                            <FormField
                              control={depositForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số tiền nạp (VNĐ)</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <CircleDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                      <Input className="pl-10" placeholder="Nhập số tiền" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Chọn số tiền bạn muốn nạp vào tài khoản
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex flex-wrap gap-2">
                              {[50000, 100000, 200000, 500000, 1000000].map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant="outline"
                                  onClick={() => depositForm.setValue("amount", amount.toString())}
                                >
                                  {amount.toLocaleString()} VNĐ
                                </Button>
                              ))}
                            </div>
                            
                            <h3 className="font-bold mt-6">Phương thức thanh toán</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {["Thẻ ngân hàng", "Ví MoMo", "ZaloPay", "VNPay"].map((method) => (
                                <div 
                                  key={method}
                                  className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                                >
                                  {method}
                                </div>
                              ))}
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={depositMutation.isPending}
                            >
                              {depositMutation.isPending ? "Đang xử lý..." : "Nạp Tiền"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      {/* Withdraw Form */}
                      <TabsContent value="withdraw" className="pt-4">
                        <Form {...depositForm}>
                          <form onSubmit={depositForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
                            <FormField
                              control={depositForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số tiền rút (VNĐ)</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <CircleDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                      <Input className="pl-10" placeholder="Nhập số tiền" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Số dư hiện tại: {user?.balance?.toLocaleString()} VNĐ
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex flex-wrap gap-2">
                              {[50000, 100000, 200000, 500000].map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant="outline"
                                  onClick={() => depositForm.setValue("amount", amount.toString())}
                                  disabled={user?.balance && amount > user.balance}
                                >
                                  {amount.toLocaleString()} VNĐ
                                </Button>
                              ))}
                            </div>
                            
                            <h3 className="font-bold mt-6">Thông tin tài khoản nhận tiền</h3>
                            <div className="space-y-4">
                              <Input placeholder="Tên chủ tài khoản" />
                              <Input placeholder="Số tài khoản" />
                              <Input placeholder="Ngân hàng" />
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={withdrawMutation.isPending}
                            >
                              {withdrawMutation.isPending ? "Đang xử lý..." : "Rút Tiền"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Promotions Tab */}
              <TabsContent value="promotions">
                <Card>
                  <CardHeader>
                    <CardTitle>Khuyến Mãi & Ưu Đãi</CardTitle>
                    <CardDescription>
                      Khám phá các ưu đãi hấp dẫn dành riêng cho bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {promotions.map((promo) => (
                        <div 
                          key={promo.id} 
                          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-40 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
                            <BadgeIcon className="h-20 w-20 text-white/80" />
                            {promo.isNew && (
                              <div className="absolute top-2 right-2 bg-secondary text-primary px-2 py-1 rounded-full text-sm font-bold">
                                Mới
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                            <p className="text-gray-600 mb-3 text-sm">{promo.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Hết hạn: {promo.expiry}</span>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => applyPromotion(promo.id)}
                                disabled={selectedPromotionId === promo.id}
                              >
                                {selectedPromotionId === promo.id ? "Đã áp dụng" : "Áp dụng"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài Đặt Tài Khoản</CardTitle>
                    <CardDescription>
                      Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-3">Thông tin cá nhân</h3>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <Input value={user?.username} disabled />
                          </div>
                          <div>
                            <FormLabel>Email</FormLabel>
                            <Input value={user?.email} />
                          </div>
                        </div>
                        <div>
                          <FormLabel>Số điện thoại</FormLabel>
                          <Input value={user?.phoneNumber || ""} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-3">Đổi mật khẩu</h3>
                      <div className="space-y-4">
                        <div>
                          <FormLabel>Mật khẩu hiện tại</FormLabel>
                          <Input type="password" />
                        </div>
                        <div>
                          <FormLabel>Mật khẩu mới</FormLabel>
                          <Input type="password" />
                        </div>
                        <div>
                          <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                          <Input type="password" />
                        </div>
                      </div>
                    </div>
                    
                    <Button>Lưu Thay Đổi</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
