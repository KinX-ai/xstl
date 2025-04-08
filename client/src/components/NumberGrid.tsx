import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberGridProps {
  selectedNumbers: string[];
  onSelectNumber: (number: string) => void;
  onClearAll: () => void;
  onRandomSelect: () => void;
  onRemoveNumber: (number: string) => void;
}

export default function NumberGrid({
  selectedNumbers,
  onSelectNumber,
  onClearAll,
  onRandomSelect,
  onRemoveNumber
}: NumberGridProps) {
  // Generate all numbers from 00 to 99
  const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
        {allNumbers.map(num => (
          <button
            key={num}
            onClick={() => onSelectNumber(num)}
            className={cn(
              "number-cell aspect-square rounded-lg border flex items-center justify-center cursor-pointer transition-all text-lg font-mono font-bold",
              selectedNumbers.includes(num)
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-800 border-gray-200 hover:border-primary"
            )}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          className="mr-2"
          onClick={onRandomSelect}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Số Ngẫu Nhiên
        </Button>
        <Button
          variant="outline"
          onClick={onClearAll}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Xóa Tất Cả
        </Button>
      </div>
      
      {/* Selected Numbers Summary */}
      {selectedNumbers.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
          <h3 className="font-bold text-lg mb-3">Số Đã Chọn</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedNumbers.map(num => (
              <div key={num} className="bg-primary text-white rounded-lg px-4 py-2 flex items-center font-mono">
                <span className="mr-2">{num}</span>
                <button 
                  className="text-white/70 hover:text-white"
                  onClick={() => onRemoveNumber(num)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
