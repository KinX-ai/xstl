import { useState } from "react";
import { LotteryResult } from "@/lib/lottery-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

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
              KQXS MIỀN BẮC
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left w-1/3">{dayOfWeek}</th>
            <th className="border p-2 text-right">Ngày: {formattedDate}</th>
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
  );
}