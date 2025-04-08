import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function PromotionCards() {
  const promotions = [
    {
      title: "Thưởng 100% cho người mới",
      description: "Nhận ngay 100% giá trị nạp đầu tiên lên đến 500.000đ khi đăng ký tài khoản mới.",
      expiryDate: "30/06/2023",
      isNew: true,
    },
    {
      title: "Hoàn tiền 10% mỗi tuần",
      description: "Nhận lại 10% tổng tiền cược mỗi tuần, không giới hạn số tiền hoàn trả.",
      expiryDate: "Áp dụng hàng tuần",
      isNew: false,
    },
    {
      title: "Giới thiệu bạn bè - Nhận thưởng",
      description: "Nhận ngay 50.000đ cho mỗi người bạn giới thiệu tham gia và nạp tiền.",
      expiryDate: "Không giới hạn",
      isNew: false,
    },
  ];

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-primary text-white pb-3">
        <CardTitle className="flex items-center text-2xl">
          <Gift className="mr-2 h-5 w-5" /> Khuyến Mãi & Ưu Đãi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo, index) => (
            <Card key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-10"/>
                  <path d="M22 7h-20v5h20v-5z"/>
                  <path d="M12 22v-15"/>
                  <path d="M12 7h4"/>
                  <path d="M12 7h-4"/>
                  <path d="M12 7v-4"/>
                </svg>
                {promo.isNew && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-primary px-2 py-1 rounded-full text-sm font-bold">
                    Mới
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                <p className="text-gray-600 mb-3">{promo.description}</p>
              </CardContent>
              <CardFooter className="px-4 py-3 bg-gray-50 border-t">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-gray-500">Hết hạn: {promo.expiryDate}</span>
                  <a href="#" className="text-blue-600 hover:underline text-sm font-bold">Chi tiết</a>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
