import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Calculator, 
  BookOpen, 
  PercentIcon 
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowToPlay() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center text-center">
            <BookOpen className="mr-3 text-primary h-8 w-8" /> Hướng Dẫn Chơi Lô Đề
          </h1>
          
          <Alert className="my-4 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <AlertTitle>Lưu ý</AlertTitle>
            <AlertDescription>
              Xổ số là hình thức giải trí có thưởng. Hãy chơi có trách nhiệm và đặt cược trong khả năng tài chính của bạn.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
              <TabsTrigger value="lo">Chơi Lô</TabsTrigger>
              <TabsTrigger value="de">Chơi Đề</TabsTrigger>
              <TabsTrigger value="xien">Lô Xiên</TabsTrigger>
            </TabsList>
            
            {/* Tổng quan về xổ số */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Tổng Quan Về Chơi Lô Đề</CardTitle>
                  <CardDescription>
                    Giới thiệu về các hình thức chơi lô đề phổ biến tại Việt Nam
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <p>
                      Lô đề là hình thức chơi dựa trên kết quả xổ số kiến thiết (KQXS) hàng ngày, 
                      đặc biệt là xổ số miền Bắc. Có hai hình thức chơi chính: <strong>Lô</strong> và <strong>Đề</strong>.
                    </p>
                    
                    <h3 className="text-xl font-medium mt-6 mb-3 flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> Các hình thức chơi chính
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-4 rounded-md bg-gray-50">
                        <h4 className="font-bold">Chơi Lô</h4>
                        <p>
                          Người chơi chọn 2 số cuối (từ 00 đến 99) và cược rằng những số này sẽ 
                          xuất hiện trong bảng kết quả xổ số.
                        </p>
                      </div>
                      
                      <div className="border p-4 rounded-md bg-gray-50">
                        <h4 className="font-bold">Chơi Đề</h4>
                        <p>
                          Người chơi chọn 2 số cuối và cược rằng những số này sẽ trùng với 2 số 
                          cuối của giải Đặc biệt.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md bg-gray-50 mt-4">
                      <h4 className="font-bold">Chơi Lô Xiên</h4>
                      <p>
                        Người chơi chọn nhiều cặp số khác nhau (xiên 2, xiên 3, xiên 4). 
                        Các số lô được chọn phải cùng về trong một kỳ quay thưởng mới được tính là trúng.
                      </p>
                    </div>
                    
                    <h3 className="text-xl font-medium mt-6 mb-3 flex items-center">
                      <PercentIcon className="h-5 w-5 mr-2 text-blue-500" /> Tỷ lệ thưởng cơ bản
                    </h3>
                    
                    <Table>
                      <TableCaption>Tỷ lệ thưởng phổ biến cho 1.000đ tiền cược</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hình thức</TableHead>
                          <TableHead>Tỷ lệ thưởng (x1.000đ)</TableHead>
                          <TableHead>Xác suất thắng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Đề</TableCell>
                          <TableCell>70 - 99</TableCell>
                          <TableCell>~1/100</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Lô</TableCell>
                          <TableCell>~70</TableCell>
                          <TableCell>~1/5.56</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Lô Xiên 2</TableCell>
                          <TableCell>10 - 20</TableCell>
                          <TableCell>Thấp hơn</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Lô Xiên 3</TableCell>
                          <TableCell>40 - 100</TableCell>
                          <TableCell>Rất thấp</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Lô Xiên 4</TableCell>
                          <TableCell>100 - 200</TableCell>
                          <TableCell>Cực thấp</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="mt-8 flex justify-center">
                      <Link href="/play-lottery">
                        <Button size="lg" className="font-medium">
                          Bắt Đầu Đặt Cược Ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Hướng dẫn chơi lô */}
            <TabsContent value="lo">
              <Card>
                <CardHeader>
                  <CardTitle>Hướng Dẫn Chơi Lô</CardTitle>
                  <CardDescription>
                    Quy tắc, cách đặt cược và tính thưởng khi chơi Lô
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-medium mb-3">Khái niệm cơ bản</h3>
                    <p>
                      <strong>Chơi Lô</strong> là hình thức dự đoán các số có 2 chữ số (từ 00 đến 99) 
                      sẽ xuất hiện trong bảng kết quả xổ số kiến thiết miền Bắc.
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-xl font-medium mb-3">Cách thức tham gia</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Chọn số:</strong> Người chơi chọn 1 hoặc nhiều cặp số từ 00 đến 99
                      </li>
                      <li>
                        <strong>Đặt cược:</strong> Quyết định số tiền cược cho mỗi con số (thường tính theo "điểm")
                      </li>
                      <li>
                        <strong>Theo dõi kết quả:</strong> Kết quả được công bố lúc 18h30 hàng ngày
                      </li>
                    </ol>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-xl font-medium mb-3">Cách tính thắng/thua</h3>
                    <p>
                      <strong>Nguyên tắc thắng:</strong> Nếu số bạn chọn xuất hiện ở bất kỳ vị trí nào 
                      trong bảng kết quả xổ số (8 giải, từ Đặc biệt đến giải Bảy), bạn sẽ thắng.
                    </p>
                    
                    <p>
                      <strong>Cách tính tiền thắng:</strong> Thông thường, với mỗi 1.000đ tiền cược, 
                      nếu trúng lô, bạn sẽ nhận được khoảng 70.000đ.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-md my-4">
                      <h4 className="font-bold text-blue-800">Ví dụ:</h4>
                      <p>
                        Bạn đặt cược vào số <strong>23</strong> với số tiền 10.000đ.
                        <br />
                        Kết quả xổ số: số <strong>23</strong> xuất hiện ở giải Năm.
                        <br />
                        Tiền thắng: 10.000đ × 70 = 700.000đ
                      </p>
                    </div>
                    
                    <Alert className="my-4 bg-green-50 border-green-200">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <AlertTitle>Mẹo chơi Lô</AlertTitle>
                      <AlertDescription>
                        Lô có tỷ lệ trúng cao hơn Đề (khoảng 18%), nhưng mức thưởng thấp hơn. 
                        Đây là hình thức phù hợp cho người chơi mới bắt đầu.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-8 flex justify-center">
                      <Link href="/play-lottery">
                        <Button size="lg" variant="outline" className="mr-4">
                          Xem Hướng Dẫn Khác
                        </Button>
                      </Link>
                      <Link href="/play-lottery">
                        <Button size="lg">
                          Đặt Lô Ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Hướng dẫn chơi đề */}
            <TabsContent value="de">
              <Card>
                <CardHeader>
                  <CardTitle>Hướng Dẫn Chơi Đề</CardTitle>
                  <CardDescription>
                    Quy tắc, cách đặt cược và tính thưởng khi chơi Đề
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-medium mb-3">Khái niệm cơ bản</h3>
                    <p>
                      <strong>Chơi Đề</strong> (hay còn gọi là "Đánh Đề") là hình thức dự đoán 2 số cuối 
                      của giải Đặc biệt trong kết quả xổ số kiến thiết miền Bắc.
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-xl font-medium mb-3">Cách thức tham gia</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Chọn số Đề:</strong> Người chơi chọn 1 hoặc nhiều cặp số từ 00 đến 99
                      </li>
                      <li>
                        <strong>Đặt cược:</strong> Quyết định số tiền cược cho mỗi con số 
                      </li>
                      <li>
                        <strong>Theo dõi kết quả:</strong> Theo dõi kết quả giải Đặc biệt lúc 18h30 hàng ngày
                      </li>
                    </ol>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-xl font-medium mb-3">Cách tính thắng/thua</h3>
                    <p>
                      <strong>Nguyên tắc thắng:</strong> Nếu 2 số cuối trong giải Đặc biệt trùng với số bạn đã chọn, bạn thắng.
                    </p>
                    
                    <p>
                      <strong>Cách tính tiền thắng:</strong> Thông thường, với mỗi 1.000đ tiền cược, 
                      nếu trúng đề, bạn sẽ nhận được từ 70.000đ đến 80.000đ (tùy nhà cái).
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-md my-4">
                      <h4 className="font-bold text-blue-800">Ví dụ:</h4>
                      <p>
                        Bạn đặt cược vào số <strong>47</strong> với số tiền 10.000đ.
                        <br />
                        Kết quả giải Đặc biệt: <strong>92547</strong> (có 2 số cuối là <strong>47</strong>).
                        <br />
                        Tiền thắng: 10.000đ × 80 = 800.000đ
                      </p>
                    </div>
                    
                    <Alert className="my-4 bg-green-50 border-green-200">
                      <HelpCircle className="h-5 w-5 text-green-500" />
                      <AlertTitle>Điểm khác biệt với chơi Lô</AlertTitle>
                      <AlertDescription>
                        Đề chỉ xét 2 số cuối của giải Đặc biệt, trong khi Lô xét tất cả các giải. 
                        Đề có tỷ lệ trúng thấp hơn (1/100) nhưng mức thưởng cao hơn.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-8 flex justify-center">
                      <Link href="/play-lottery">
                        <Button size="lg" variant="outline" className="mr-4">
                          Xem Hướng Dẫn Khác
                        </Button>
                      </Link>
                      <Link href="/play-lottery">
                        <Button size="lg">
                          Đặt Đề Ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Hướng dẫn chơi lô xiên */}
            <TabsContent value="xien">
              <Card>
                <CardHeader>
                  <CardTitle>Hướng Dẫn Chơi Lô Xiên</CardTitle>
                  <CardDescription>
                    Quy tắc, cách đặt cược và tính thưởng khi chơi Lô Xiên
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-medium mb-3">Khái niệm cơ bản</h3>
                    <p>
                      <strong>Lô Xiên</strong> là hình thức chơi kết hợp từ 2 đến 4 số lô khác nhau trong cùng một vé. 
                      Người chơi thắng khi tất cả các số được chọn cùng xuất hiện trong kết quả xổ số.
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-xl font-medium mb-3">Các loại Lô Xiên</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-4 rounded-md bg-gray-50">
                        <h4 className="font-bold">Lô Xiên 2</h4>
                        <p>
                          Chọn 2 số lô khác nhau, cả 2 số phải cùng về trong kỳ quay thưởng
                        </p>
                      </div>
                      
                      <div className="border p-4 rounded-md bg-gray-50">
                        <h4 className="font-bold">Lô Xiên 3</h4>
                        <p>
                          Chọn 3 số lô khác nhau, cả 3 số phải cùng về trong kỳ quay thưởng
                        </p>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-md bg-gray-50 mt-4">
                      <h4 className="font-bold">Lô Xiên 4</h4>
                      <p>
                        Chọn 4 số lô khác nhau, cả 4 số phải cùng về trong kỳ quay thưởng
                      </p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="text-xl font-medium mb-3">Tỷ lệ trả thưởng</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hình thức</TableHead>
                          <TableHead>Tỷ lệ thưởng (x1.000đ)</TableHead>
                          <TableHead>Khó khăn</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Xiên 2</TableCell>
                          <TableCell>x15</TableCell>
                          <TableCell>Trung bình</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Xiên 3</TableCell>
                          <TableCell>x40</TableCell>
                          <TableCell>Cao</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Xiên 4</TableCell>
                          <TableCell>x100</TableCell>
                          <TableCell>Rất cao</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <Separator className="my-4" />
                    
                    <div className="bg-blue-50 p-4 rounded-md my-4">
                      <h4 className="font-bold text-blue-800">Ví dụ về Xiên 2:</h4>
                      <p>
                        Bạn đặt Xiên 2 cho cặp số <strong>27</strong> và <strong>68</strong> với số tiền 10.000đ.
                        <br />
                        Kết quả xổ số: cả số <strong>27</strong> và <strong>68</strong> cùng xuất hiện trong các giải.
                        <br />
                        Tiền thắng: 10.000đ × 15 = 150.000đ
                      </p>
                    </div>
                    
                    <Alert className="my-4 bg-yellow-50 border-yellow-200">
                      <Calculator className="h-5 w-5 text-yellow-500" />
                      <AlertTitle>Mẹo chơi Xiên</AlertTitle>
                      <AlertDescription>
                        Lô Xiên có tỷ lệ thắng thấp hơn nhưng tiền thưởng cao hơn, đặc biệt là Xiên 3 và Xiên 4. 
                        Đây là hình thức phù hợp cho người chơi muốn thử vận may với số tiền cược nhỏ.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-8 flex justify-center">
                      <Link href="/play-lottery">
                        <Button size="lg" variant="outline" className="mr-4">
                          Xem Hướng Dẫn Khác
                        </Button>
                      </Link>
                      <Link href="/play-lottery">
                        <Button size="lg">
                          Đặt Lô Xiên Ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}