import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, User, Menu, ChevronsDown, LogOut, Settings, CreditCard, Home, BarChart2, Gamepad2, History, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('vi-VN').format(balance);
  };

  const navItems = [
    { path: "/", label: "Trang chủ", icon: <Home className="w-4 h-4 mr-2" /> },
    { path: "/results", label: "Kết Quả Xổ Số", icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { path: "/play", label: "Chơi Ngay", icon: <Gamepad2 className="w-4 h-4 mr-2" /> },
    { path: "/history", label: "Lịch Sử", icon: <History className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-400 h-6 w-6" />
            <span className="font-bold text-xl">XỔ SỐ MIỀN BẮC</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={cn(
                  "py-2 hover:text-yellow-400 transition-colors flex items-center", 
                  location === item.path ? "text-yellow-400" : ""
                )}>
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center bg-primary-dark rounded-full px-3 py-1">
                  <CreditCard className="text-yellow-400 h-4 w-4 mr-2" />
                  <span className="font-mono">{formatBalance(user.balance)}đ</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary-dark">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{user.username}</span>
                        <ChevronsDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <a className="flex w-full cursor-pointer items-center">
                          <User className="mr-2 h-4 w-4" />
                          Hồ sơ cá nhân
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=transactions">
                        <a className="flex w-full cursor-pointer items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Nạp/Rút tiền
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=settings">
                        <a className="flex w-full cursor-pointer items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Cài đặt
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button className="bg-yellow-400 text-primary hover:bg-yellow-500">
                  Đăng Nhập / Đăng Ký
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a 
                  className={cn(
                    "block py-2 px-3 rounded flex items-center", 
                    location === item.path 
                      ? "bg-primary-dark text-yellow-400" 
                      : "hover:bg-primary-dark"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            ))}
            
            {/* Mobile Balance */}
            {user && (
              <div className="flex items-center py-2 px-3">
                <CreditCard className="text-yellow-400 h-4 w-4 mr-2" />
                <span className="font-mono">{formatBalance(user.balance)}đ</span>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
