import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, UserIcon, CircleDollarSign, LogOut, Menu, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Trophy className="text-secondary text-2xl" />
            <Link href="/">
              <span className="font-heading font-bold text-xl cursor-pointer">XỔ SỐ MIỀN BẮC</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className="py-2 hover:text-secondary transition-colors cursor-pointer">Trang chủ</span>
            </Link>
            <Link href="/results">
              <span className="py-2 hover:text-secondary transition-colors cursor-pointer">Kết Quả Xổ Số</span>
            </Link>
            <Link href="/play-lottery">
              <span className="py-2 hover:text-secondary transition-colors cursor-pointer">Chơi Ngay</span>
            </Link>
            <Link href="/guide">
              <span className="py-2 hover:text-secondary transition-colors cursor-pointer">Hướng Dẫn Chơi</span>
            </Link>
            <Link href="/history">
              <span className="py-2 hover:text-secondary transition-colors cursor-pointer">Lịch Sử</span>
            </Link>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center bg-primary-dark rounded-full px-3 py-1">
                  <CircleDollarSign className="text-secondary mr-2 h-4 w-4" />
                  <span className="font-mono">{user.balance?.toLocaleString()}đ</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-700" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <span className="w-full flex items-center cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Hồ sơ cá nhân</span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=transactions">
                        <span className="w-full flex items-center cursor-pointer">
                          <CircleDollarSign className="mr-2 h-4 w-4" />
                          <span>Nạp/Rút tiền</span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="secondary" className="font-heading font-bold">
                <Link href="/auth">
                  Đăng Nhập / Đăng Ký
                </Link>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button variant="ghost" className="md:hidden" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1">
            <Link href="/">
              <span className="block py-2 hover:bg-primary-dark px-3 rounded cursor-pointer">Trang chủ</span>
            </Link>
            <Link href="/results">
              <span className="block py-2 hover:bg-primary-dark px-3 rounded cursor-pointer">Kết Quả Xổ Số</span>
            </Link>
            <Link href="/play-lottery">
              <span className="block py-2 hover:bg-primary-dark px-3 rounded cursor-pointer">Chơi Ngay</span>
            </Link>
            <Link href="/guide">
              <span className="block py-2 hover:bg-primary-dark px-3 rounded cursor-pointer">Hướng Dẫn Chơi</span>
            </Link>
            <Link href="/history">
              <span className="block py-2 hover:bg-primary-dark px-3 rounded cursor-pointer">Lịch Sử</span>
            </Link>
            {/* Mobile Balance */}
            {user && (
              <div className="flex items-center py-2 px-3">
                <CircleDollarSign className="text-secondary mr-2 h-4 w-4" />
                <span className="font-mono">{user.balance?.toLocaleString()}đ</span>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
