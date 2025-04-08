import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy, LockIcon, UserIcon, MailIcon, PhoneIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";

const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  // If user is already logged in, redirect to home page
  React.useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Xổ Số Miền Bắc</CardTitle>
              <CardDescription className="text-center">
                Đăng nhập hoặc đăng ký để tham gia chơi xổ số
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Đăng Nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng Ký</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="pt-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Nhập tên đăng nhập" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LockIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" type="password" placeholder="Nhập mật khẩu" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register" className="pt-4">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Nhập tên đăng nhập" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MailIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" placeholder="example@email.com" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <PhoneIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" placeholder="0123456789" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LockIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" type="password" placeholder="Nhập mật khẩu" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <LockIcon className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-9" type="password" placeholder="Xác nhận mật khẩu" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Đang đăng ký..." : "Đăng Ký"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-sm text-center text-muted-foreground">
                Bằng cách đăng ký, bạn đồng ý với các điều khoản sử dụng và chính sách bảo mật của chúng tôi.
              </p>
            </CardFooter>
          </Card>
        </div>
        
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-r from-primary to-primary/90 rounded-lg p-8 text-white">
          <div className="mb-8">
            <Trophy className="h-16 w-16 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Xổ Số Miền Bắc</h2>
            <p className="text-white/90 text-lg mb-6">
              Hệ thống xổ số trực tuyến uy tín với kết quả cập nhật nhanh chóng và chính xác từ kỳ quay xổ số miền Bắc hàng ngày.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Kết quả chính xác</h3>
                <p className="text-white/80">Cập nhật kết quả xổ số miền Bắc nhanh chóng và chính xác mỗi ngày.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <LockIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Bảo mật cao</h3>
                <p className="text-white/80">Hệ thống bảo mật đảm bảo thông tin cá nhân và giao dịch của bạn luôn được an toàn.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Dễ dàng sử dụng</h3>
                <p className="text-white/80">Giao diện thân thiện, dễ sử dụng giúp bạn dễ dàng tham gia và theo dõi kết quả.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
