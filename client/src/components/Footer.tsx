import { Link } from "wouter";
import { Facebook, Youtube, Mail, MapPin, Phone, Clock, Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Trophy className="text-yellow-400 h-5 w-5 mr-2" /> XỔ SỐ MIỀN BẮC
            </h3>
            <p className="text-gray-400 mb-4">
              Hệ thống xổ số trực tuyến uy tín hàng đầu Việt Nam với kết quả cập nhật nhanh chóng và chính xác.
            </p>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Youtube />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/">
                  <a className="hover:text-white transition-colors">Trang chủ</a>
                </Link>
              </li>
              <li>
                <Link href="/results">
                  <a className="hover:text-white transition-colors">Kết quả xổ số</a>
                </Link>
              </li>
              <li>
                <Link href="/play">
                  <a className="hover:text-white transition-colors">Chơi ngay</a>
                </Link>
              </li>
              <li>
                <Link href="/history">
                  <a className="hover:text-white transition-colors">Lịch sử giao dịch</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn chơi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>123 Đường Cầu Giấy, Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>0123.456.789</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>support@xosomienbac.vn</span>
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 Xổ Số Miền Bắc. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-4">
            <svg className="h-6" viewBox="0 0 60 30" fill="#fff">
              <rect width="60" height="30" fill="#2566af"/>
              <path d="M25,7l-5,15h-3l-5-15h3l3.5,11l3.5-11h3z" fill="#fff"/>
            </svg>
            <svg className="h-6" viewBox="0 0 60 30" fill="#fff">
              <rect width="60" height="30" fill="#eb001b" rx="4"/>
              <circle cx="30" cy="15" r="10" fill="#f79e1b"/>
            </svg>
            <svg className="h-6" viewBox="0 0 60 30" fill="#fff">
              <rect width="60" height="30" fill="#a50064" rx="4"/>
              <text x="8" y="20" fontFamily="Arial" fontSize="14" fill="#fff">MOMO</text>
            </svg>
            <svg className="h-6" viewBox="0 0 60 30" fill="#fff">
              <rect width="60" height="30" fill="#0066b3" rx="4"/>
              <text x="8" y="20" fontFamily="Arial" fontSize="14" fill="#fff">VNPAY</text>
            </svg>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Chơi có trách nhiệm. Chỉ dành cho người trên 18 tuổi.</p>
        </div>
      </div>
    </footer>
  );
}
