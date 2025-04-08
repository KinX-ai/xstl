import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, AlertCircle } from "lucide-react";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";

export default function TransactionHistory() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: transactions, error, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-primary text-white pb-3">
          <CardTitle className="flex items-center text-2xl">
            <History className="mr-2 h-5 w-5" /> Lịch Sử Giao Dịch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-primary text-white pb-3">
          <CardTitle className="flex items-center text-2xl">
            <History className="mr-2 h-5 w-5" /> Lịch Sử Giao Dịch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-600 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter and search transactions
  const filteredTransactions = transactions
    ? transactions.filter((transaction) => {
        const matchesFilter = filter === "all" || transaction.type === filter;
        const matchesSearch = search === "" || 
          transaction.details?.toLowerCase().includes(search.toLowerCase()) ||
          transaction.amount.toString().includes(search);
        return matchesFilter && matchesSearch;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Helper functions
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bet":
        return { text: "Đặt cược", bg: "bg-blue-100 text-blue-800" };
      case "win":
        return { text: "Trúng thưởng", bg: "bg-green-100 text-green-800" };
      case "deposit":
        return { text: "Nạp tiền", bg: "bg-purple-100 text-purple-800" };
      case "withdraw":
        return { text: "Rút tiền", bg: "bg-orange-100 text-orange-800" };
      default:
        return { text: type, bg: "bg-gray-100 text-gray-800" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "Đang chờ", bg: "bg-yellow-100 text-yellow-800" };
      case "completed":
        return { text: "Hoàn thành", bg: "bg-green-100 text-green-800" };
      case "failed":
        return { text: "Thất bại", bg: "bg-red-100 text-red-800" };
      default:
        return { text: status, bg: "bg-gray-100 text-gray-800" };
    }
  };

  const formatAmount = (type: string, amount: number) => {
    const formatted = new Intl.NumberFormat("vi-VN").format(amount);
    if (["withdraw", "bet"].includes(type)) {
      return (
        <span className="text-red-500">-{formatted}đ</span>
      );
    } else {
      return (
        <span className="text-green-500">+{formatted}đ</span>
      );
    }
  };

  const formatDate = (dateString: Date) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary text-white pb-3">
        <CardTitle className="flex items-center text-2xl">
          <History className="mr-2 h-5 w-5" /> Lịch Sử Giao Dịch
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              placeholder="Tìm kiếm giao dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="bet">Đặt cược</SelectItem>
              <SelectItem value="win">Trúng thưởng</SelectItem>
              <SelectItem value="deposit">Nạp tiền</SelectItem>
              <SelectItem value="withdraw">Rút tiền</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Không có giao dịch nào.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Thời gian</th>
                    <th className="py-2 px-4 border-b text-left">Loại</th>
                    <th className="py-2 px-4 border-b text-left">Chi tiết</th>
                    <th className="py-2 px-4 border-b text-right">Số tiền</th>
                    <th className="py-2 px-4 border-b text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction, index) => {
                    const typeLabel = getTypeLabel(transaction.type);
                    const statusLabel = getStatusLabel(transaction.status);
                    
                    return (
                      <tr key={transaction.id} className={index % 2 === 0 ? "" : "bg-gray-50"}>
                        <td className="py-3 px-4 border-b">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <span className={`${typeLabel.bg} px-2 py-1 rounded text-xs`}>
                            {typeLabel.text}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b">
                          {transaction.details || "-"}
                        </td>
                        <td className="py-3 px-4 border-b text-right font-mono">
                          {formatAmount(transaction.type, transaction.amount)}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <span className={`${statusLabel.bg} px-2 py-1 rounded text-xs`}>
                            {statusLabel.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} trên tổng số {filteredTransactions.length} giao dịch
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 border border-gray-300 rounded ${
                      currentPage === 1
                        ? "bg-white text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 border border-gray-300 rounded ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className={`px-3 py-1 border border-gray-300 rounded ${
                      currentPage === totalPages
                        ? "bg-white text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
