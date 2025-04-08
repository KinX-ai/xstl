import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestResults, LotteryResult } from "@/lib/lottery-api";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trophy, GamepadIcon, HistoryIcon, GiftIcon, ArrowRightIcon } from "lucide-react";
import ResultsTable from "@/components/lottery/results-table";

export default function HomePage() {
  const { user } = useAuth();
  const { data: lotteryResults, isLoading } = useQuery({
    queryKey: ["/api/lottery/results/latest"],
    queryFn: () => fetchLatestResults(),
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Hero Banner Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-white leading-tight mb-4">
                  Xổ Số Miền Bắc Chính Thống
                </h1>
                <p className="text-white/90 mb-6 text-lg">
                  Tham gia chơi xổ số trực tuyến với hệ thống cập nhật kết quả nhanh chóng và chính xác nhất.
                </p>
                <div className="flex space-x-4">
                  <Button asChild variant="secondary" className="font-bold">
                    <Link href="/play">
                      <GamepadIcon className="mr-2 h-4 w-4" /> Chơi Ngay
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="bg-white/10 text-white hover:bg-white/20 font-bold">
                    <Link href="/results">
                      <Trophy className="mr-2 h-4 w-4" /> Xem Kết Quả
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 p-6 flex items-center justify-center relative">
                <div className="rounded-lg shadow-lg max-w-full h-auto bg-white/10 p-10 flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl font-bold font-mono animate-[float_3s_ease-in-out_infinite]" 
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Floating lottery balls */}
                <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold font-mono animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}>
                  27
                </div>
                <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold font-mono animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}>
                  68
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Sections */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-primary">
                <Trophy className="mr-2 h-5 w-5" /> Kết Quả Xổ Số
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Xem kết quả xổ số miền Bắc mới nhất và lịch sử các kỳ quay.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/results">
                  Xem Kết Quả <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-primary">
                <GamepadIcon className="mr-2 h-5 w-5" /> Chơi Xổ Số
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Đặt cược các số yêu thích của bạn và tham gia dự thưởng ngay hôm nay.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/play">
                  Chơi Ngay <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-primary">
                <HistoryIcon className="mr-2 h-5 w-5" /> Lịch Sử Giao Dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Theo dõi lịch sử đặt cược, thanh toán và thắng cược của bạn.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/history">
                  Xem Lịch Sử <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-primary">
                <GiftIcon className="mr-2 h-5 w-5" /> Khuyến Mãi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Khám phá các ưu đãi và khuyến mãi hấp dẫn dành cho bạn.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">
                  Xem Ưu Đãi <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Latest Results Section */}
        <section className="mb-8">
          <Card>
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
                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="results">Kết Quả</TabsTrigger>
                    <TabsTrigger value="check">Kiểm Tra Vé</TabsTrigger>
                  </TabsList>
                  <TabsContent value="results" className="pt-4">
                    <ResultsTable results={lotteryResults} />
                  </TabsContent>
                  <TabsContent value="check" className="pt-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-heading font-bold text-lg mb-3">Kiểm Tra Kết Quả</h3>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow">
                          <input 
                            type="text" 
                            placeholder="Nhập số của bạn (2 số hoặc nhiều hơn)" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <Button>Kiểm Tra</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  Không thể tải kết quả xổ số. Vui lòng thử lại sau.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
