import { useState } from "react";
import { LotteryResult } from "@/lib/lottery-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsTableProps {
  results: LotteryResult;
}

// Định nghĩa tỷ lệ trả thưởng cho các loại giải
const PRIZE_RATES = {
  special: 80000, // Đặc biệt: 1, số trúng x 80.000đ
  first: 25000,   // Giải nhất: 1 số trúng x 25.000đ
  second: 10000,  // Giải nhì: 1 số trúng x 10.000đ
  third: 5000,    // Giải ba: 1 số trúng x 5.000đ
  fourth: 1200,   // Giải tư: 1 số trúng x 1.200đ
  fifth: 600,     // Giải năm: 1 số trúng x 600đ
  sixth: 400,     // Giải sáu: 1 số trúng x 400đ
  seventh: 200,   // Giải bảy: 1 số trúng x 200đ
  // Các tỷ lệ cho lô
  lo2so: 70,      // Lô 2 số: 1 số trúng x 70đ
  lo3so: 700,     // Lô 3 số: 1 số trúng x 700đ
  xienhai: 15,    // Xiên 2: 1 cặp trúng x 15đ
  xienba: 40,     // Xiên 3: 1 bộ 3 trúng x 40đ
  xienbon: 100,   // Xiên 4: 1 bộ 4 trúng x 100đ
};

export default function ResultsTable({ results }: ResultsTableProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("Miền bắc");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Format date to display
  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return new Date().toLocaleDateString('vi-VN');
    if (dateStr === "null") return new Date().toLocaleDateString('vi-VN');
    
    try {
      if (dateStr.includes("Ngày:")) {
        return dateStr;
      }
      
      // Try to parse as ISO date
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return dateStr;
    }
  };
  
  // Get day of week
  const getDayOfWeek = (dateStr: string | null) => {
    if (!dateStr) return "Thứ hai";
    if (dateStr === "null") return "Thứ hai";
    
    try {
      const date = new Date(dateStr);
      const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
      return days[date.getDay()];
    } catch (e) {
      return "Thứ hai";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-yellow-500 text-white py-2 px-4">
          <CardTitle className="text-center text-xl">KQXS MIỀN BẮC</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">KẾT QUẢ XỔ SỐ:</span>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Chọn miền" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Miền bắc">Miền bắc</SelectItem>
                    <SelectItem value="Miền trung">Miền trung</SelectItem>
                    <SelectItem value="Miền nam">Miền nam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Ngày:</span>
                <Select 
                  value={selectedDate} 
                  onValueChange={setSelectedDate}
                >
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Render 7 days starting from today going back */}
                    {Array.from({length: 7}).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      const dateStr = date.toISOString().split('T')[0];
                      return (
                        <SelectItem key={i} value={dateStr}>
                          {date.toLocaleDateString('vi-VN')}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="ketqua" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="ketqua">Kết Quả Xổ Số</TabsTrigger>
                <TabsTrigger value="tyle">Tỷ Lệ Trả Thưởng</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ketqua">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-yellow-500 text-white">
                        <th colSpan={2} className="text-center py-2">
                          KQXS MIỀN BẮC
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left w-1/4">{getDayOfWeek(results.date)}</th>
                        <th className="border p-2 text-left">Ngày: {formatDateDisplay(results.date)}</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      <tr>
                        <td className="border p-2 font-medium">Giải ĐB</td>
                        <td className="border p-2 text-center font-bold text-blue-800">{results.results.special}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải nhất</td>
                        <td className="border p-2 text-center">{results.results.first}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải nhì</td>
                        <td className="border p-2 text-center">{results.results.second.join(" - ")}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải ba</td>
                        <td className="border p-2 text-center">{results.results.third.join(" - ")}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải tư</td>
                        <td className="border p-2 text-center">{results.results.fourth.join(" - ")}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải năm</td>
                        <td className="border p-2 text-center">{results.results.fifth.join(" - ")}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải sáu</td>
                        <td className="border p-2 text-center">{results.results.sixth.join(" - ")}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Giải bảy</td>
                        <td className="border p-2 text-center">{results.results.seventh.join(" - ")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="text-gray-500">Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}</div>
                  <a href="#archive" className="text-blue-500 hover:underline">Xem kết quả các kỳ trước</a>
                </div>
              </TabsContent>
              
              <TabsContent value="tyle">
                <div className="text-center">
                  <div className="font-bold text-xl text-primary mb-2">TỶ LỆ TRẢ THƯỞNG</div>
                  <div className="text-gray-500 mb-4">Tỷ lệ trả thưởng cho mỗi 1.000đ đặt cược</div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border-b">Loại Giải</th>
                          <th className="py-2 px-4 border-b">Tỷ Lệ Trả Thưởng (x1.000đ)</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Đặc biệt</td>
                          <td className="py-2 px-4 border-b text-lg font-bold text-primary">x{PRIZE_RATES.special.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải nhất</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.first.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải nhì</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.second.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải ba</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.third.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải tư</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.fourth.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải năm</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.fifth.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải sáu</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.sixth.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Giải bảy</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.seventh.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium border-t-2 border-gray-300">Lô 2 số</td>
                          <td className="py-2 px-4 border-b border-t-2 border-gray-300">x{PRIZE_RATES.lo2so.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Lô 3 số</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.lo3so.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Xiên 2</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.xienhai.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Xiên 3</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.xienba.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b font-medium">Xiên 4</td>
                          <td className="py-2 px-4 border-b">x{PRIZE_RATES.xienbon.toLocaleString()}đ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    *Tỷ lệ trả thưởng có thể thay đổi. Vui lòng liên hệ admin để biết thêm chi tiết.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
