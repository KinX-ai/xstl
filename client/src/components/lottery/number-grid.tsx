import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NumberGridProps {
  selectedNumbers: string[];
  onNumberSelect: (number: string) => void;
  mode?: "regular" | "bacanh";
}

export default function NumberGrid({ 
  selectedNumbers, 
  onNumberSelect,
  mode = "regular"
}: NumberGridProps) {
  const [digitMode, setDigitMode] = useState<"2digit" | "3digit">(mode === "bacanh" ? "3digit" : "2digit");

  // Create array of numbers based on mode
  const get2DigitNumbers = () => Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
  const get3DigitNumbers = () => Array.from({ length: 1000 }, (_, i) => i.toString().padStart(3, '0'));

  const allNumbers = digitMode === "2digit" ? get2DigitNumbers() : get3DigitNumbers();
  
  // For 3-digit numbers, we need to paginate them
  const [page, setPage] = useState(0);
  const itemsPerPage = 100; // Show 100 items per page for 3-digit mode
  
  const paginatedNumbers = digitMode === "3digit" 
    ? allNumbers.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
    : allNumbers;
  
  const totalPages = digitMode === "3digit" ? Math.ceil(allNumbers.length / itemsPerPage) : 1;

  return (
    <div>
      {mode === "bacanh" && (
        <Tabs value={digitMode} onValueChange={(val) => setDigitMode(val as "2digit" | "3digit")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="2digit">2 chữ số</TabsTrigger>
            <TabsTrigger value="3digit">3 chữ số</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {paginatedNumbers.map((num) => (
          <div 
            key={num}
            className={cn(
              "number-cell aspect-square rounded-lg border flex items-center justify-center cursor-pointer transition-all text-lg font-mono font-bold",
              selectedNumbers.includes(num) 
                ? "bg-primary text-white border-primary" 
                : "bg-white text-gray-800 border-gray-200 hover:border-primary"
            )}
            onClick={() => onNumberSelect(num)}
          >
            {num}
          </div>
        ))}
      </div>
      
      {digitMode === "3digit" && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button 
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 0}
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
          >
            Trang trước
          </button>
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <button 
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === totalPages - 1}
            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
