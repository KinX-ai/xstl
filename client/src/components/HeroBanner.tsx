import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Newspaper, Gamepad2 } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="font-bold text-3xl md:text-4xl text-white leading-tight mb-4">
              Xổ Số Miền Bắc Chính Thống
            </h1>
            <p className="text-white/90 mb-6 text-lg">
              Tham gia chơi xổ số trực tuyến với hệ thống cập nhật kết quả nhanh chóng và chính xác nhất.
            </p>
            <div className="flex space-x-4">
              <Button asChild className="bg-yellow-400 text-primary hover:bg-yellow-500">
                <Link href="/play">
                  <span className="flex items-center">
                    <Gamepad2 className="mr-2 h-4 w-4" /> Chơi Ngay
                  </span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                <Link href="/results">
                  <span className="flex items-center">
                    <Newspaper className="mr-2 h-4 w-4" /> Xem Kết Quả
                  </span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 p-6 flex items-center justify-center relative">
            <div className="relative h-64 w-full flex items-center justify-center">
              <svg width="300" height="200" viewBox="0 0 300 200" className="absolute">
                <circle cx="150" cy="100" r="80" fill="#f1f5f9" />
                <g transform="translate(150, 100)">
                  {[...Array(10)].map((_, i) => (
                    <circle 
                      key={i} 
                      cx={70 * Math.cos(i * Math.PI / 5)} 
                      cy={70 * Math.sin(i * Math.PI / 5)} 
                      r="15" 
                      fill="#d7282f" 
                    />
                  ))}
                </g>
              </svg>
              
              {/* Floating lottery balls */}
              <div 
                className="absolute top-10 right-10 w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold font-mono animate-[float_3s_ease-in-out_infinite]" 
                style={{ animationDelay: "0.2s" }}
              >
                27
              </div>
              <div 
                className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold font-mono animate-[float_3s_ease-in-out_infinite]" 
                style={{ animationDelay: "0.4s" }}
              >
                68
              </div>
              <Trophy className="absolute h-24 w-24 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
