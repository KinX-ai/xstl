import { cn } from "@/lib/utils";

interface NumberGridProps {
  selectedNumbers: string[];
  onNumberSelect: (number: string) => void;
}

export default function NumberGrid({ selectedNumbers, onNumberSelect }: NumberGridProps) {
  // Create array of numbers from 00 to 99
  const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {allNumbers.map((num) => (
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
  );
}
