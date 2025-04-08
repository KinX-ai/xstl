import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@shared/schema";

interface TransactionsTableProps {
  transactions: any[];
  isLoading: boolean;
}

export default function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có giao dịch nào để hiển thị.</p>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bet':
        return { label: 'Đặt cược', color: 'bg-blue-100 text-blue-800' };
      case 'win':
        return { label: 'Trúng thưởng', color: 'bg-green-100 text-green-800' };
      case 'deposit':
        return { label: 'Nạp tiền', color: 'bg-purple-100 text-purple-800' };
      case 'withdraw':
        return { label: 'Rút tiền', color: 'bg-orange-100 text-orange-800' };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' };
      case 'completed':
        return { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' };
      case 'failed':
        return { label: 'Thất bại', color: 'bg-red-100 text-red-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thời gian</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Chi tiết</TableHead>
            <TableHead className="text-right">Số tiền</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const typeInfo = getTypeLabel(transaction.type);
            const statusInfo = getStatusLabel(transaction.status);
            
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Badge className={`${typeInfo.color} hover:${typeInfo.color}`}>
                    {typeInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.details || '-'}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  <span className={transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}đ
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`${statusInfo.color} hover:${statusInfo.color}`}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
