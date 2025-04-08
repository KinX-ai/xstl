import { LotteryResult } from "@/lib/lottery-api";

interface ResultsTableProps {
  results: LotteryResult;
}

export default function ResultsTable({ results }: ResultsTableProps) {
  // Format date
  const formattedDate = results.date ? new Date(results.date).toLocaleDateString('vi-VN') : 'Ngày hôm nay';

  return (
    <div className="text-center">
      <div className="font-heading font-bold text-xl text-primary mb-2">KẾT QUẢ XỔ SỐ KIẾN THIẾT MIỀN BẮC</div>
      <div className="text-gray-500 mb-4">{formattedDate}</div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Giải</th>
              <th className="py-2 px-4 border-b">Kết quả</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold text-primary">Đặc biệt</td>
              <td className="py-2 px-4 border-b text-lg font-bold">{results.results.special}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải nhất</td>
              <td className="py-2 px-4 border-b">{results.results.first}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải nhì</td>
              <td className="py-2 px-4 border-b">
                <div className="grid grid-cols-2 gap-2">
                  {results.results.second.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải ba</td>
              <td className="py-2 px-4 border-b">
                <div className="grid grid-cols-3 gap-2">
                  {results.results.third.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải tư</td>
              <td className="py-2 px-4 border-b">
                <div className="grid grid-cols-4 gap-2">
                  {results.results.fourth.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải năm</td>
              <td className="py-2 px-4 border-b">
                <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                  {results.results.fifth.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải sáu</td>
              <td className="py-2 px-4 border-b">
                <div className="grid grid-cols-3 gap-2">
                  {results.results.sixth.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-heading font-bold">Giải bảy</td>
              <td className="py-2 px-4 border-b">
                <div className="grid grid-cols-4 gap-2">
                  {results.results.seventh.map((num, idx) => (
                    <div key={idx}>{num}</div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-gray-600">
        <a href="#archive" className="text-blue-500 hover:underline">Xem kết quả các kỳ trước</a>
      </div>
    </div>
  );
}
