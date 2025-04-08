import { Trophy } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center">
              <Trophy className="text-secondary text-xl mr-2" /> XỔ SỐ MIỀN BẮC
            </h3>
            <p className="text-gray-400 mb-4">
              Hệ thống xổ số trực tuyến uy tín hàng đầu Việt Nam với kết quả cập nhật nhanh chóng và chính xác.
            </p>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <i className="ri-facebook-circle-fill"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <i className="ri-youtube-fill"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <i className="ri-telegram-fill"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/">
                  <span className="hover:text-white transition-colors cursor-pointer">Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link href="/results">
                  <span className="hover:text-white transition-colors cursor-pointer">Kết quả xổ số</span>
                </Link>
              </li>
              <li>
                <Link href="/play">
                  <span className="hover:text-white transition-colors cursor-pointer">Chơi ngay</span>
                </Link>
              </li>
              <li>
                <Link href="/history">
                  <span className="hover:text-white transition-colors cursor-pointer">Lịch sử giao dịch</span>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <span className="hover:text-white transition-colors cursor-pointer">Tài khoản</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">Hướng dẫn chơi</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Liên hệ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <i className="ri-map-pin-line mr-2 mt-1"></i>
                <span>123 Đường Cầu Giấy, Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center">
                <i className="ri-phone-line mr-2"></i>
                <span>0123.456.789</span>
              </li>
              <li className="flex items-center">
                <i className="ri-mail-line mr-2"></i>
                <span>support@xosomienbac.vn</span>
              </li>
              <li className="flex items-center">
                <i className="ri-time-line mr-2"></i>
                <span>24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 Xổ Số Miền Bắc. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-4">
            <span className="text-gray-400 text-sm">Các phương thức thanh toán được hỗ trợ</span>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Chơi có trách nhiệm. Chỉ dành cho người trên 18 tuổi.</p>
        </div>
      </div>
    </footer>
  );
}
