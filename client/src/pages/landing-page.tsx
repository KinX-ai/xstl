import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  CalendarCheck, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Download, 
  Gift, 
  LogIn, 
  MessageCircle, 
  PhoneCall, 
  ShieldCheck, 
  Star, 
  Smartphone, 
  UserPlus, 
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestResults } from "@/lib/lottery-api";
import ResultsTable from "@/components/lottery/results-table";

export default function LandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [contactOpen, setContactOpen] = useState(false);
  
  // Lấy kết quả xổ số mới nhất
  const { data: latestResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ["/api/lottery/results/latest"],
    queryFn: fetchLatestResults,
  });
  
  // Cuộn đến phần được chỉ định
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Các tính năng chính của trang web
  const features = [
    {
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      title: "Đặt cược dễ dàng",
      description: "Đặt cược trực tuyến chỉ với vài thao tác đơn giản, tiện lợi và nhanh chóng."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Kết quả chính xác",
      description: "Kết quả xổ số được cập nhật tự động và chính xác từ nguồn chính thức."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      title: "An toàn & Bảo mật",
      description: "Hệ thống bảo mật cao cấp đảm bảo thông tin cá nhân và giao dịch của bạn luôn được bảo vệ."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Thanh toán nhanh chóng",
      description: "Nhận thưởng nhanh chóng và an toàn ngay sau khi có kết quả trúng thưởng."
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-500" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn 24/7."
    },
    {
      icon: <Gift className="h-6 w-6 text-red-500" />,
      title: "Khuyến mãi hấp dẫn",
      description: "Nhiều ưu đãi và khuyến mãi đặc biệt dành cho người chơi thường xuyên."
    }
  ];
  
  // Khung giờ xổ số
  const drawSchedule = [
    { day: "Thứ Hai", time: "18:30", region: "Miền Bắc" },
    { day: "Thứ Ba", time: "18:30", region: "Miền Bắc" },
    { day: "Thứ Tư", time: "18:30", region: "Miền Bắc" },
    { day: "Thứ Năm", time: "18:30", region: "Miền Bắc" },
    { day: "Thứ Sáu", time: "18:30", region: "Miền Bắc" },
    { day: "Thứ Bảy", time: "18:30", region: "Miền Bắc" },
    { day: "Chủ Nhật", time: "18:30", region: "Miền Bắc" }
  ];
  
  // Đánh giá của khách hàng
  const testimonials = [
    {
      name: "Nguyễn Văn A",
      avatar: "/avatar1.jpg",
      rating: 5,
      content: "Tôi đã trúng thưởng lớn nhờ hệ thống dự đoán thông minh của trang web này. Giao diện đẹp, dễ sử dụng và thanh toán cực kỳ nhanh chóng."
    },
    {
      name: "Trần Thị B",
      avatar: "/avatar2.jpg",
      rating: 5,
      content: "Đội ngũ hỗ trợ rất nhiệt tình và chuyên nghiệp. Tôi đã được hướng dẫn tận tình khi mới bắt đầu và giờ đã thành thạo cách đặt cược."
    },
    {
      name: "Lê Văn C",
      avatar: "/avatar3.jpg",
      rating: 4,
      content: "Trang web có nhiều loại hình đặt cược đa dạng và tỷ lệ trả thưởng cao. Tôi thực sự ấn tượng với tốc độ cập nhật kết quả xổ số."
    }
  ];
  
  // Hướng dẫn sử dụng
  const guides = [
    {
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản miễn phí chỉ trong vài giây với email hoặc số điện thoại.",
      icon: <UserPlus className="h-10 w-10 text-primary" />
    },
    {
      title: "Đăng nhập & Nạp tiền",
      description: "Đăng nhập vào tài khoản và nạp tiền qua nhiều phương thức thanh toán khác nhau.",
      icon: <LogIn className="h-10 w-10 text-blue-500" />
    },
    {
      title: "Chọn số & Đặt cược",
      description: "Chọn số yêu thích và đặt cược với các loại hình đa dạng: Đề, Lô, Xiên,...",
      icon: <DollarSign className="h-10 w-10 text-green-500" />
    },
    {
      title: "Theo dõi kết quả",
      description: "Xem kết quả xổ số được cập nhật trực tiếp và nhanh chóng vào 18:30 hàng ngày.",
      icon: <CalendarCheck className="h-10 w-10 text-yellow-500" />
    }
  ];
  
  // CTA chính
  const handleMainCTA = () => {
    if (user) {
      navigate("/play-lottery");
    } else {
      navigate("/auth");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary mr-2">XỔ SỐ MIỀN BẮC</h1>
              <Badge variant="outline" className="hidden md:flex">Chính Thức</Badge>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                className="text-gray-600 hover:text-primary"
                onClick={() => scrollToSection('features')}
              >
                Tính Năng
              </button>
              <button 
                className="text-gray-600 hover:text-primary"
                onClick={() => scrollToSection('results')}
              >
                Kết Quả
              </button>
              <button 
                className="text-gray-600 hover:text-primary"
                onClick={() => scrollToSection('guide')}
              >
                Hướng Dẫn
              </button>
              <button 
                className="text-gray-600 hover:text-primary"
                onClick={() => scrollToSection('faq')}
              >
                Hỏi Đáp
              </button>
            </nav>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline">Bảng Điều Khiển</Button>
                  </Link>
                  <Link href="/play-lottery">
                    <Button>Đặt Cược Ngay</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline">Đăng Nhập</Button>
                  </Link>
                  <Link href="/auth">
                    <Button>Đăng Ký</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-primary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Xổ Số Kiến Thiết Miền Bắc</h1>
              <p className="text-xl mb-8 opacity-90">
                Dễ dàng tham gia xổ số trực tuyến với tỷ lệ trả thưởng cao và giao diện thân thiện.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={handleMainCTA}
                >
                  Bắt Đầu Ngay <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => scrollToSection('results')}
                >
                  Xem Kết Quả Hôm Nay
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm">An Toàn & Bảo Mật</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Hỗ Trợ Khách Hàng</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold">5 Phút</div>
                  <div className="text-sm">Thanh Toán Nhanh</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <Card className="w-full max-w-md">
                <CardHeader className="bg-primary text-white">
                  <CardTitle className="text-center">Kết Quả Mới Nhất</CardTitle>
                  <CardDescription className="text-center text-white/80">
                    Cập nhật lúc 18:30 hàng ngày
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoadingResults ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : latestResults ? (
                    <div className="font-mono">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-500">Ngày {new Date(latestResults.date || Date.now()).toLocaleDateString('vi-VN')}</div>
                        <div className="text-2xl font-bold text-primary">
                          Giải Đặc Biệt: <span className="text-red-600">{latestResults.results.special}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded-md">
                          <div className="font-medium">Giải Nhất:</div>
                          <div>{latestResults.results.first}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-md">
                          <div className="font-medium">Giải Nhì:</div>
                          <div>{latestResults.results.second[0]}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-md col-span-2">
                          <div className="font-medium">Giải Ba:</div>
                          <div className="flex flex-wrap gap-1">
                            {latestResults.results.third.map((num, idx) => (
                              <span key={idx} className="px-1">{num}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <Button 
                          variant="link" 
                          className="text-primary"
                          onClick={() => scrollToSection('results')}
                        >
                          Xem đầy đủ kết quả
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có dữ liệu kết quả
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleMainCTA}
                  >
                    Đặt Cược Ngay
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tính Năng Nổi Bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm những tính năng hàng đầu giúp bạn dễ dàng tham gia xổ số trực tuyến
              một cách thuận tiện và an toàn nhất.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href={user ? "/play-lottery" : "/auth"}>
              <Button size="lg">
                {user ? "Đặt Cược Ngay" : "Đăng Ký & Bắt Đầu"} <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Results Section */}
      <section id="results" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kết Quả Xổ Số</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cập nhật kết quả xổ số kiến thiết miền Bắc chính xác và nhanh chóng nhất
            </p>
          </div>
          
          {isLoadingResults ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : latestResults ? (
            <ResultsTable results={latestResults} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu kết quả
            </div>
          )}
          
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Lịch Mở Thưởng</CardTitle>
                <CardDescription>Xổ số mở thưởng lúc 18:30 hàng ngày</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {drawSchedule.map((schedule, index) => (
                    <div key={index} className="border p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CalendarCheck className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">{schedule.day}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {schedule.time}
                      </div>
                      <div className="text-sm text-gray-500">{schedule.region}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Guide Section */}
      <section id="guide" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hướng Dẫn Đặt Cược</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chỉ với 4 bước đơn giản, bạn có thể bắt đầu đặt cược và có cơ hội trúng những giải thưởng lớn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guides.map((guide, index) => (
              <Card key={index} className="border-none shadow-md text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-4">
                    {guide.icon}
                  </div>
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                    {index + 1}
                  </div>
                  <CardTitle>{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{guide.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setContactOpen(true)}
            >
              Cần Hỗ Trợ? Liên Hệ Chúng Tôi <MessageCircle className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khách Hàng Nói Gì?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đánh giá từ những người chơi đã có trải nghiệm thực tế với dịch vụ của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến về xổ số kiến thiết miền Bắc
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
              <TabsTrigger value="betting">Đặt Cược</TabsTrigger>
              <TabsTrigger value="payment">Thanh Toán</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Cơ Bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Xổ số kiến thiết miền Bắc là gì?</h3>
                    <p className="text-gray-600">
                      Xổ số kiến thiết miền Bắc là hình thức xổ số truyền thống được tổ chức hàng ngày tại khu vực miền Bắc Việt Nam.
                      Kết quả xổ số được công bố vào 18:30 hàng ngày và bao gồm các giải từ giải Đặc biệt đến giải Bảy.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Trang web này có hợp pháp không?</h3>
                    <p className="text-gray-600">
                      Trang web của chúng tôi là nền tảng hợp pháp để xem kết quả và đặt cược xổ số.
                      Chúng tôi tuân thủ nghiêm ngặt các quy định pháp luật và được cấp phép bởi các cơ quan chức năng.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Tôi có thể tham gia từ đâu?</h3>
                    <p className="text-gray-600">
                      Bạn có thể tham gia từ bất kỳ đâu, miễn là bạn có kết nối internet và đủ 18 tuổi trở lên.
                      Trang web hỗ trợ tất cả các thiết bị từ máy tính đến điện thoại di động.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="betting">
              <Card>
                <CardHeader>
                  <CardTitle>Hướng Dẫn Đặt Cược</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Tôi có thể đặt cược những loại nào?</h3>
                    <p className="text-gray-600">
                      Chúng tôi cung cấp nhiều loại hình đặt cược khác nhau bao gồm: Đề (đặt số giải Đặc biệt),
                      Lô (đặt 2 hoặc 3 số cuối trong các giải), và Xiên (kết hợp nhiều số).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Tỷ lệ trả thưởng là bao nhiêu?</h3>
                    <p className="text-gray-600">
                      Tỷ lệ trả thưởng phụ thuộc vào loại cược bạn chọn. Đề có tỷ lệ cao nhất (1 ăn 80),
                      Lô 2 số (1 ăn 70), Lô 3 số (1 ăn 700), Xiên 2 (1 ăn 15), Xiên 3 (1 ăn 40), Xiên 4 (1 ăn 100).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Tôi có thể cược tối đa bao nhiêu?</h3>
                    <p className="text-gray-600">
                      Mức cược tối thiểu là 1.000đ và tối đa là 10.000.000đ cho mỗi lần cược.
                      Bạn có thể đặt nhiều lần trong một ngày nhưng tổng số tiền cược không vượt quá hạn mức của tài khoản.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Thanh Toán & Trả Thưởng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Tôi có thể nạp tiền bằng cách nào?</h3>
                    <p className="text-gray-600">
                      Chúng tôi hỗ trợ nhiều phương thức nạp tiền bao gồm: Chuyển khoản ngân hàng,
                      Ví điện tử (Momo, ZaloPay, VNPay), và Thẻ cào điện thoại. Số tiền nạp tối thiểu là 50.000đ.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Khi nào tôi nhận được tiền thưởng?</h3>
                    <p className="text-gray-600">
                      Tiền thưởng sẽ được cộng vào tài khoản của bạn ngay sau khi có kết quả xổ số và hệ thống xác nhận trúng thưởng,
                      thường trong vòng 5-10 phút sau khi công bố kết quả.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Làm thế nào để rút tiền?</h3>
                    <p className="text-gray-600">
                      Bạn có thể rút tiền từ tài khoản qua chuyển khoản ngân hàng hoặc ví điện tử.
                      Thời gian xử lý rút tiền thường từ 5 phút đến 24 giờ tùy thuộc vào phương thức rút tiền.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Không tìm thấy câu trả lời bạn cần?</p>
            <Button 
              onClick={() => setContactOpen(true)}
            >
              Liên Hệ Hỗ Trợ <MessageCircle className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bắt Đầu Ngay Hôm Nay</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Đăng ký tài khoản miễn phí và nhận ngay ưu đãi 50.000đ vào tài khoản
            khi nạp tiền lần đầu để bắt đầu hành trình chinh phục những giải thưởng lớn!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={handleMainCTA}
            >
              {user ? "Đặt Cược Ngay" : "Đăng Ký & Bắt Đầu"} <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white hover:bg-white/20"
              onClick={() => window.open('https://play.google.com/store', '_blank')}
            >
              <Download className="h-5 w-5 mr-2" /> Tải Ứng Dụng
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">XỔ SỐ MIỀN BẮC</h3>
              <p className="text-gray-400 mb-4">
                Nền tảng xổ số trực tuyến hàng đầu Việt Nam với kết quả chính xác và tỷ lệ trả thưởng cao.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Liên Kết Nhanh</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/play-lottery" className="text-gray-400 hover:text-primary transition-colors">Đặt Cược</Link>
                </li>
                <li>
                  <Link href="/lottery-results" className="text-gray-400 hover:text-primary transition-colors">Kết Quả Xổ Số</Link>
                </li>
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-primary transition-colors">Đăng Nhập / Đăng Ký</Link>
                </li>
                <li>
                  <button 
                    className="text-gray-400 hover:text-primary transition-colors"
                    onClick={() => scrollToSection('guide')}
                  >
                    Hướng Dẫn
                  </button>
                </li>
                <li>
                  <button 
                    className="text-gray-400 hover:text-primary transition-colors"
                    onClick={() => scrollToSection('faq')}
                  >
                    Câu Hỏi Thường Gặp
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                    <PhoneCall className="h-4 w-4 mr-2" /> Hotline: 1900 xxxx
                  </a>
                </li>
                <li>
                  <a href="mailto:support@xosomienbac.com" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" /> Email Hỗ Trợ
                  </a>
                </li>
                <li>
                  <button 
                    className="text-gray-400 hover:text-primary transition-colors flex items-center"
                    onClick={() => setContactOpen(true)}
                  >
                    <Smartphone className="h-4 w-4 mr-2" /> Liên Hệ Trực Tuyến
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Tải Ứng Dụng</h3>
              <p className="text-gray-400 mb-4">
                Tải ứng dụng để có trải nghiệm tốt nhất trên thiết bị di động.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" className="border-gray-600" onClick={() => window.open('https://play.google.com/store', '_blank')}>
                  <Download className="h-5 w-5 mr-2" /> Android
                </Button>
                <Button variant="outline" className="border-gray-600" onClick={() => window.open('https://www.apple.com/app-store/', '_blank')}>
                  <Download className="h-5 w-5 mr-2" /> iOS
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} XỔ SỐ MIỀN BẮC. Tất cả các quyền được bảo lưu.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Chúng tôi khuyến khích chơi có trách nhiệm. Chỉ dành cho người trên 18 tuổi.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Liên Hệ Hỗ Trợ</DialogTitle>
            <DialogDescription>
              Gửi yêu cầu hỗ trợ hoặc câu hỏi của bạn, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Họ tên</label>
              <Input id="name" placeholder="Nhập họ tên của bạn" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" placeholder="email@example.com" type="email" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">Nội dung tin nhắn</label>
              <Textarea id="message" placeholder="Nhập câu hỏi hoặc yêu cầu hỗ trợ..." rows={4} />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setContactOpen(false)}>Hủy</Button>
            <Button onClick={() => {
              setContactOpen(false);
              // Hiển thị thông báo gửi thành công
              alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            }}>Gửi Yêu Cầu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}