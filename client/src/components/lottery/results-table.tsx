import { useState, useEffect } from "react";
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
  const [headNumbers, setHeadNumbers] = useState<{ [key: string]: string[] }>({});
  const [tailNumbers, setTailNumbers] = useState<{ [key: string]: string[] }>({});
  
  // Kiểm tra trạng thái quay thưởng
  const isDrawing = results.drawState === "drawing";
  
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

  // Phân tích các số đầu và đuôi của kết quả
  useEffect(() => {
    if (!isDrawing && results.results) {
      const heads: { [key: string]: string[] } = {};
      const tails: { [key: string]: string[] } = {};
      
      // Xử lý giải đặc biệt
      if (results.results.special) {
        const special = results.results.special;
        // Đầu
        if (special.length >= 2) {
          const head = special.substring(0, 2);
          heads[head] = heads[head] || [];
          heads[head].push("ĐB");
        }
        // Đuôi
        if (special.length >= 2) {
          const tail = special.substring(special.length - 2);
          tails[tail] = tails[tail] || [];
          tails[tail].push("ĐB");
        }
      }
      
      // Xử lý giải nhất
      if (results.results.first) {
        const first = results.results.first;
        // Đầu
        if (first.length >= 2) {
          const head = first.substring(0, 2);
          heads[head] = heads[head] || [];
          heads[head].push("Nhất");
        }
        // Đuôi
        if (first.length >= 2) {
          const tail = first.substring(first.length - 2);
          tails[tail] = tails[tail] || [];
          tails[tail].push("Nhất");
        }
      }
      
      // Xử lý giải nhì
      results.results.second.forEach(num => {
        if (num && num.length >= 2) {
          // Đầu
          const head = num.substring(0, 2);
          heads[head] = heads[head] || [];
          heads[head].push("Nhì");
          
          // Đuôi
          const tail = num.substring(num.length - 2);
          tails[tail] = tails[tail] || [];
          tails[tail].push("Nhì");
        }
      });
      
      // Xử lý giải ba
      results.results.third.forEach(num => {
        if (num && num.length >= 2) {
          // Đầu
          const head = num.substring(0, 2);
          heads[head] = heads[head] || [];
          heads[head].push("Ba");
          
          // Đuôi
          const tail = num.substring(num.length - 2);
          tails[tail] = tails[tail] || [];
          tails[tail].push("Ba");
        }
      });
      
      // Xử lý giải tư
      results.results.fourth.forEach(num => {
        if (num) {
          if (num.length === 4) {
            // Đầu
            const head = num.substring(0, 2);
            heads[head] = heads[head] || [];
            heads[head].push("Tư");
            
            // Đuôi
            const tail = num.substring(num.length - 2);
            tails[tail] = tails[tail] || [];
            tails[tail].push("Tư");
          } else if (num.length === 2) {
            // Nếu chỉ có 2 số, coi như đuôi
            tails[num] = tails[num] || [];
            tails[num].push("Tư");
          }
        }
      });
      
      // Xử lý giải năm
      results.results.fifth.forEach(num => {
        if (num && num.length >= 2) {
          // Đầu
          const head = num.substring(0, 2);
          heads[head] = heads[head] || [];
          heads[head].push("Năm");
          
          // Đuôi
          const tail = num.substring(num.length - 2);
          tails[tail] = tails[tail] || [];
          tails[tail].push("Năm");
        }
      });
      
      // Xử lý giải sáu
      results.results.sixth.forEach(num => {
        if (num) {
          if (num.length === 3) {
            // Đuôi từ 3 số
            const tail = num.substring(num.length - 2);
            tails[tail] = tails[tail] || [];
            tails[tail].push("Sáu");
          } else if (num.length === 2) {
            // Nếu chỉ có 2 số, coi như đuôi
            tails[num] = tails[num] || [];
            tails[num].push("Sáu");
          }
        }
      });
      
      // Xử lý giải bảy
      results.results.seventh.forEach(num => {
        if (num) {
          // Giải bảy thường là 2 số, nên coi như đuôi
          tails[num] = tails[num] || [];
          tails[num].push("Bảy");
        }
      });
      
      setHeadNumbers(heads);
      setTailNumbers(tails);
    }
  }, [results, isDrawing]);

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
      return <span className="font-bold text-red-600">{value || "-"}</span>;
    }
    
    return value || "-";
  };

  // Hàm tạo mảng dựa trên chữ số đầu
  const getNumbersForHead = (digit: number) => {
    const result: string[] = [];
    
    Object.keys(headNumbers).forEach(num => {
      if (num.startsWith(digit.toString())) {
        result.push(num);
      }
    });
    
    return result.sort();
  };
  
  // Hàm tạo mảng dựa trên chữ số đuôi
  const getNumbersForTail = (digit: number) => {
    const result: string[] = [];
    
    Object.keys(tailNumbers).forEach(num => {
      if (num.startsWith(digit.toString())) {
        result.push(num);
      }
    });
    
    return result.sort();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Bảng kết quả chính */}
      <div className="md:col-span-6 lg:col-span-6 border rounded shadow-sm overflow-hidden">
        <div className="bg-blue-100 p-2 text-center font-bold">
          <div className="text-xl text-blue-800">KẾT QUẢ MỚI NHẤT</div>
          <div>{dayOfWeek} - {formattedDate}</div>
        </div>
        <table className="w-full border-collapse text-center">
          <tbody>
            <tr>
              <td className="border p-2 font-bold bg-blue-50 w-14">ĐB</td>
              <td className="border p-2 text-center text-red-600 font-bold text-xl" colSpan={3}>
                {renderPrizeCell(results.results.special, 'special')}
              </td>
            </tr>
            
            <tr>
              <td className="border p-2 font-bold bg-blue-50">Nhất</td>
              <td className="border p-2 text-center font-semibold" colSpan={3}>
                {renderPrizeCell(results.results.first)}
              </td>
            </tr>
            
            <tr>
              <td className="border p-2 font-bold bg-blue-50">Nhì</td>
              {isDrawing ? (
                <td className="border p-2 text-center" colSpan={3}>
                  {renderPrizeCell(results.results.second)}
                </td>
              ) : (
                <>
                  {results.results.second.slice(0, 2).map((num, i) => (
                    <td key={i} className="border p-2 text-center">
                      {num}
                    </td>
                  ))}
                  {/* Fill empty cells if needed */}
                  {results.results.second.length < 2 && (
                    <td colSpan={2 - results.results.second.length} className="border p-2"></td>
                  )}
                </>
              )}
            </tr>
            
            <tr>
              <td className="border p-2 font-bold bg-blue-50" rowSpan={2}>Ba</td>
              {isDrawing ? (
                <td className="border p-2 text-center" colSpan={3}>
                  {renderPrizeCell(results.results.third)}
                </td>
              ) : (
                <>
                  {results.results.third.slice(0, 3).map((num, i) => (
                    <td key={i} className="border p-2 text-center">
                      {num}
                    </td>
                  ))}
                  {/* Fill empty cells if needed */}
                  {results.results.third.length < 3 && (
                    <td colSpan={3 - results.results.third.slice(0, 3).length} className="border p-2"></td>
                  )}
                </>
              )}
            </tr>
            
            {!isDrawing && (
              <tr>
                <td className="border p-2 text-center">
                  {results.results.third[3] || ""}
                </td>
                <td className="border p-2 text-center">
                  {results.results.third[4] || ""}
                </td>
                <td className="border p-2 text-center">
                  {results.results.third[5] || ""}
                </td>
              </tr>
            )}

            <tr>
              <td className="border p-2 font-bold bg-blue-50">Tư</td>
              {isDrawing ? (
                <td className="border p-2 text-center" colSpan={3}>
                  {renderPrizeCell(results.results.fourth)}
                </td>
              ) : (
                <>
                  <td className="border p-2 text-center">
                    {results.results.fourth[0] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.fourth[1] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.fourth[2] || ""}
                  </td>
                </>
              )}
            </tr>
            
            <tr>
              <td className="border p-2 font-bold bg-blue-50" rowSpan={2}>Năm</td>
              {isDrawing ? (
                <td className="border p-2 text-center" colSpan={3}>
                  {renderPrizeCell(results.results.fifth)}
                </td>
              ) : (
                <>
                  <td className="border p-2 text-center">
                    {results.results.fifth[0] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.fifth[1] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.fifth[2] || ""}
                  </td>
                </>
              )}
            </tr>
            
            {!isDrawing && (
              <tr>
                <td className="border p-2 text-center">
                  {results.results.fifth[3] || ""}
                </td>
                <td className="border p-2 text-center">
                  {results.results.fifth[4] || ""}
                </td>
                <td className="border p-2 text-center">
                  {results.results.fifth[5] || ""}
                </td>
              </tr>
            )}
            
            <tr>
              <td className="border p-2 font-bold bg-blue-50">Sáu</td>
              {isDrawing ? (
                <td className="border p-2 text-center" colSpan={3}>
                  {renderPrizeCell(results.results.sixth)}
                </td>
              ) : (
                <>
                  <td className="border p-2 text-center">
                    {results.results.sixth[0] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.sixth[1] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.sixth[2] || ""}
                  </td>
                </>
              )}
            </tr>
            
            <tr>
              <td className="border p-2 font-bold bg-blue-50">Bảy</td>
              {isDrawing ? (
                <td className="border p-2 text-center" colSpan={3}>
                  {renderPrizeCell(results.results.seventh)}
                </td>
              ) : (
                <>
                  <td className="border p-2 text-center">
                    {results.results.seventh[0] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.seventh[1] || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {results.results.seventh[2] || ""}
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
        
        {isDrawing && (
          <div className="text-center p-2 bg-gray-50 text-sm text-gray-500 italic">
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Đang quay thưởng - Cập nhật tự động</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Bảng đầu */}
      {!isDrawing && (
        <div className="md:col-span-3 lg:col-span-3 border rounded shadow-sm overflow-hidden">
          <div className="bg-orange-100 p-2 text-center font-bold">
            Đầu
          </div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td className="border p-1 font-bold bg-orange-50 w-10 text-center text-lg">{i}</td>
                  <td className="border p-1 text-lg">
                    {getNumbersForHead(i).join(", ") || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Bảng đuôi */}
      {!isDrawing && (
        <div className="md:col-span-3 lg:col-span-3 border rounded shadow-sm overflow-hidden">
          <div className="bg-purple-100 p-2 text-center font-bold">
            Đuôi
          </div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td className="border p-1 font-bold bg-purple-50 w-10 text-center text-lg">{i}</td>
                  <td className="border p-1 text-lg">
                    {getNumbersForTail(i).join(", ") || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}