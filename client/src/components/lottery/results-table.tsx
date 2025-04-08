import { useState } from "react";
import { LotteryResult } from "@/lib/lottery-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface ResultsTableProps {
  results: LotteryResult;
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("Miền bắc");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Get day of week
  const getDayOfWeek = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
      return days[date.getDay()];
    } catch (e) {
      return "Thứ hai";
    }
  };

  // Chuẩn bị dữ liệu giống với hình mẫu
  const formattedDate = format(new Date(selectedDate), "dd/MM/yyyy");
  const dayOfWeek = getDayOfWeek(selectedDate);
  
  // Kiểm tra trạng thái quay thưởng
  const isDrawing = results.drawState === "drawing";

  // Render cell với trạng thái loading nếu đang quay thưởng
  const renderPrizeCell = (value: string | string[], type: string = 'normal') => {
    if (isDrawing && (!value || (Array.isArray(value) && value.every(v => !v)))) {
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-500">Đang quay...</span>
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return value.join(" - ") || "-";
    }
    
    if (type === 'special') {
      return <span className="font-bold text-blue-800">{value || "-"}</span>;
    }
    
    return value || "-";
  };

  return (
    <div className="w-full border rounded shadow-sm">
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm">KẾT QUẢ XỔ SỐ:</span>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[150px] h-8 text-sm">
              <SelectValue placeholder="Miền bắc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Miền bắc">Miền bắc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Ngày:</span>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue placeholder={formattedDate} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 7}).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <SelectItem key={i} value={dateStr}>
                    {format(date, "dd/MM/yyyy")}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-yellow-500 text-white">
            <th colSpan={2} className="text-center py-2 font-bold">
              KQXS MIỀN BẮC {isDrawing && <span className="ml-2 inline-flex items-center rounded-full bg-white px-2 py-1 text-xs font-medium text-yellow-800">Đang quay</span>}
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left w-1/3">{dayOfWeek}</th>
            <th className="border p-2 text-right">
              Ngày: {formattedDate}
              {isDrawing && <span className="ml-2 text-xs text-gray-600">({results.drawTime})</span>}
            </th>
          </tr>
        </thead>
        <tbody className="font-mono">
          <tr>
            <td className="border p-2 font-medium">Giải ĐB</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.special, 'special')}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải nhất</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.first)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải nhì</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.second)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải ba</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.third)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải tư</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.fourth)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải năm</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.fifth)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải sáu</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.sixth)}</td>
          </tr>
          <tr>
            <td className="border p-2 font-medium">Giải bảy</td>
            <td className="border p-2 text-center">{renderPrizeCell(results.results.seventh)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}