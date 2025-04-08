import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, AlertCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LotteryResult {
  date: string;
  prizes: {
    name: string;
    numbers: string[];
  }[];
}

export default function LotteryResults() {
  const [results, setResults] = useState<LotteryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchResult, setSearchResult] = useState<{found: boolean, prize?: string} | null>(null);

  useEffect(() => {
    // Function to load and parse the MinhNgoc lottery results
    const loadLotteryResults = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch from MinhNgoc API
        // For this demo, we'll use mock data structure
        const mockResult: LotteryResult = {
          date: new Date().toLocaleDateString('vi-VN'),
          prizes: [
            { name: "Đặc biệt", numbers: ["92568"] },
            { name: "Giải nhất", numbers: ["48695"] },
            { name: "Giải nhì", numbers: ["92735", "19304"] },
            { name: "Giải ba", numbers: ["39857", "90815", "16359", "83649", "21947", "12376"] },
            { name: "Giải tư", numbers: ["1947", "3658", "7539", "5824"] },
            { name: "Giải năm", numbers: ["5297", "8714", "3852", "2957", "0463", "3175"] },
            { name: "Giải sáu", numbers: ["794", "359", "651"] },
            { name: "Giải bảy", numbers: ["58", "94", "71", "23"] }
          ]
        };
        
        setResults(mockResult);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải kết quả xổ số. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    loadLotteryResults();
  }, []);

  const handleSearch = () => {
    if (!searchNumber || !results) return;
    
    let found = false;
    let prizeName = "";
    
    for (const prize of results.prizes) {
      for (const number of prize.numbers) {
        // Check if the last digits match
        if (number.endsWith(searchNumber)) {
          found = true;
          prizeName = prize.name;
          break;
        }
      }
      if (found) break;
    }
    
    setSearchResult({ found, prize: found ? prizeName : undefined });
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-primary text-white pb-3">
        <CardTitle className="flex items-center text-2xl">
          <Trophy className="mr-2 h-5 w-5" /> Kết Quả Xổ Số Mới Nhất
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-600 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        ) : (
          <>
            <Tabs defaultValue="results">
              <TabsList className="mb-4">
                <TabsTrigger value="results">Kết Quả</TabsTrigger>
                <TabsTrigger value="check">Kiểm Tra Vé</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results">
                <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto">
                  <div className="text-center">
                    <div className="font-bold text-xl text-primary mb-2">KẾT QUẢ XỔ SỐ KIẾN THIẾT MIỀN BẮC</div>
                    <div className="text-gray-500 mb-4">{results?.date}</div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">Giải</th>
                            <th className="py-2 px-4 border-b">Kết quả</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono">
                          {results?.prizes.map((prize, index) => (
                            <tr key={index} className={index % 2 === 0 ? "" : "bg-gray-50"}>
                              <td className={`py-2 px-4 border-b font-bold ${prize.name === "Đặc biệt" ? "text-primary" : ""}`}>
                                {prize.name}
                              </td>
                              <td className="py-2 px-4 border-b">
                                <div className={`grid grid-cols-${Math.min(prize.numbers.length, 4)} gap-2`}>
                                  {prize.numbers.map((num, i) => (
                                    <div key={i} className={`text-center ${prize.name === "Đặc biệt" ? "text-lg font-bold" : ""}`}>
                                      {num}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 text-gray-600">
                      <a href="#archive" className="text-blue-600 hover:underline">Xem kết quả các kỳ trước</a>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="check">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-3">Kiểm Tra Kết Quả</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <Input 
                        type="text" 
                        placeholder="Nhập số của bạn (2 số hoặc nhiều hơn)" 
                        value={searchNumber}
                        onChange={(e) => setSearchNumber(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSearch}
                    >
                      <Search className="mr-2 h-4 w-4" /> Kiểm Tra
                    </Button>
                  </div>
                  
                  {searchResult && (
                    <div className={`mt-4 p-3 rounded-lg ${searchResult.found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {searchResult.found ? (
                        <p className="font-medium">
                          Chúc mừng! Số {searchNumber} của bạn đã trúng {searchResult.prize}.
                        </p>
                      ) : (
                        <p className="font-medium">
                          Rất tiếc! Số {searchNumber} của bạn không trúng giải nào.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
