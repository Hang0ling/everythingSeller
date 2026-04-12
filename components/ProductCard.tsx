import React, { useRef, useState, useEffect } from 'react';
import { ProductData } from '../types';
import { 
  ArrowLeft, Share2, ShoppingCart, MoreHorizontal, ChevronRight, 
  Store, MessageCircle, Star, Download, Wifi, Battery, Signal 
} from 'lucide-react';

interface ProductCardProps {
  data: ProductData | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    // Update every second to keep it accurate when they look at it
    const interval = setInterval(updateTime, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current || !window.html2canvas) return;
    
    try {
      const canvas = await window.html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2, // High resolution
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `product-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Oops, couldn't download the image.");
    }
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl shadow-lg p-8 border border-dashed border-gray-300">
        <ShoppingCart size={48} className="mb-4 opacity-20" />
        <p>Chat with AI to generate a product...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* The Downloadable Area */}
      <div 
        ref={cardRef} 
        className="w-[375px] h-[812px] bg-[#f5f5f5] relative overflow-hidden shadow-2xl rounded-3xl shrink-0 text-sans"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
      >
        {/* Status Bar Mock */}
        <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-30 text-black font-medium text-[15px]">
          <span className="tracking-wide">{timeString}</span>
          <div className="flex items-center gap-2">
             <Signal size={18} className="text-black fill-black" />
             <Wifi size={18} className="text-black" />
             <div className="relative flex items-center justify-center">
                <Battery size={24} className="text-black opacity-80" />
                {/* Battery fill */}
                <div className="absolute left-[3px] top-[7px] w-[14px] h-[10px] bg-black rounded-[1px]"></div>
             </div>
          </div>
        </div>

        {/* Navigation Overlay */}
        <div className="absolute top-12 left-0 w-full px-4 flex justify-between items-center z-20">
            <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/50 transition-colors cursor-pointer">
                <ArrowLeft size={18} />
            </div>
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/50 transition-colors cursor-pointer">
                    <Share2 size={16} />
                </div>
                <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/50 transition-colors cursor-pointer">
                    <ShoppingCart size={16} />
                </div>
                <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/50 transition-colors cursor-pointer">
                    <MoreHorizontal size={16} />
                </div>
            </div>
        </div>

        {/* Product Image */}
        <div className="w-full h-[500px] bg-gray-200 relative">
            <img 
                src={data.imageUrl} 
                alt="Product" 
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
            />
            {/* Page indicator */}
            <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-md">
                2/5
            </div>
            {/* Overlay Tags */}
            <div className="absolute bottom-4 right-14 flex gap-1">
                 <span className="bg-black/30 text-white text-[10px] px-1 py-0.5 rounded backdrop-blur-md">视频</span>
                 <span className="bg-black/30 text-white text-[10px] px-1 py-0.5 rounded backdrop-blur-md">图集</span>
            </div>
        </div>

        {/* Red Banner */}
        <div className="w-full h-14 bg-gradient-to-r from-[#ff3355] to-[#ff0033] flex justify-between items-center px-4 text-white relative overflow-hidden">
            <div className="z-10">
                <div className="text-sm font-bold">{data.saleLabel || '年货补贴周'}</div>
                <div className="text-xs flex items-baseline gap-1 mt-0.5">
                    <span>店铺优惠后</span>
                    <span className="text-base font-bold">¥{data.price}</span>
                    <span className="opacity-80 line-through scale-90">¥{data.originalPrice}</span>
                </div>
            </div>
            <div className="z-10 text-right">
                <div className="text-xs opacity-90">1月19日 24点结束</div>
                <div className="text-xs opacity-80 mt-0.5">已售 {Math.floor(Math.random() * 1000)}</div>
            </div>
            {/* Decorative circles */}
            <div className="absolute right-20 -top-4 w-12 h-12 bg-white/10 rounded-full blur-md"></div>
            <div className="absolute left-32 -bottom-6 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white -mt-2 rounded-t-xl relative z-10 px-3 pb-20">
            {/* Extra Discount Tag */}
            <div className="pt-3 pb-2">
                 <span className="inline-block bg-[#ff0033] text-white text-xs font-bold px-2 py-0.5 rounded-sm mr-2">
                     平台加补后 ¥{Math.floor(Number(data.price) * 0.9)}
                 </span>
                 <span className="text-[#ff0033] text-xs">含消费券再减25元</span>
                 <ChevronRight size={12} className="inline text-[#ff0033]" />
            </div>

            {/* Title Section */}
            <div className="flex mt-2">
                <div className="flex-1">
                    <h1 className="text-gray-900 font-bold text-[16px] leading-snug line-clamp-2">
                        <span className="bg-[#de1222] text-white text-[10px] px-1 rounded-sm align-middle mr-1 relative -top-0.5">天猫</span>
                        {data.title}
                    </h1>
                </div>
                <div className="w-16 flex flex-col items-center justify-start pt-1 ml-1 border-l border-gray-100">
                     <Share2 size={14} className="text-gray-400" />
                     <span className="text-[10px] text-gray-400 mt-1">分享</span>
                </div>
            </div>
            
            {/* Simple Tags */}
            <div className="mt-3 bg-[#fdf5f5] rounded-lg p-2 flex flex-wrap gap-2">
                <span className="text-[#ff5000] text-xs font-medium">推荐搭配清单</span>
                {data.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[#ff5000] text-xs border border-[#ff5000]/20 px-1 rounded-sm">{tag}</span>
                ))}
            </div>

             {/* Services */}
             <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">发货</span>
                    <span className="flex-1 text-gray-800">浙江嘉兴 | 快递: 免运费</span>
                    <span className="text-gray-400">销量 {Math.floor(Math.random() * 5000)}+</span>
                </div>
                <div className="flex items-center gap-2">
                     <span className="font-bold text-gray-800">保障</span>
                     <div className="flex items-center gap-3">
                         {['极速退款', '退货宝', '七天无理由'].map(t => (
                             <span key={t} className="flex items-center gap-0.5 text-gray-800">
                                 <div className="w-1 h-1 rounded-full border border-gray-400"></div> {t}
                             </span>
                         ))}
                     </div>
                     <ChevronRight size={14} className="ml-auto text-gray-300" />
                </div>
             </div>

             {/* Shop Bar */}
             <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-black rounded text-white flex items-center justify-center font-bold text-xs">
                         {data.shopName.substring(0, 1)}
                     </div>
                     <div>
                         <div className="font-bold text-sm text-gray-900">{data.shopName}旗舰店</div>
                         <div className="text-[10px] bg-black text-[#e5b367] px-1 rounded-sm inline-block mt-0.5">品牌黑标</div>
                     </div>
                 </div>
                 <div className="flex gap-2">
                     <button className="text-xs border border-red-500 text-red-500 px-3 py-1 rounded-full">进店</button>
                     <button className="text-xs bg-red-500 text-white px-3 py-1 rounded-full">全部宝贝</button>
                 </div>
             </div>

        </div>

        {/* Bottom Tab Bar */}
        <div className="absolute bottom-0 w-full h-[50px] bg-white border-t border-gray-100 flex items-center px-2 z-20 pb-safe">
             <div className="flex w-[40%] justify-around text-[10px] text-gray-600">
                 <div className="flex flex-col items-center">
                     <Store size={18} />
                     <span>店铺</span>
                 </div>
                 <div className="flex flex-col items-center">
                     <MessageCircle size={18} />
                     <span>客服</span>
                 </div>
                 <div className="flex flex-col items-center">
                     <Star size={18} />
                     <span>收藏</span>
                 </div>
             </div>
             <div className="flex w-[60%] h-9 rounded-full overflow-hidden ml-1">
                 <div className="flex-1 bg-gradient-to-r from-[#ffc500] to-[#ff9402] text-white flex flex-col items-center justify-center leading-none">
                     <span className="text-[13px] font-bold">加入购物车</span>
                 </div>
                 <div className="flex-1 bg-gradient-to-r from-[#ff7700] to-[#ff4900] text-white flex flex-col items-center justify-center leading-none">
                     <span className="text-[13px] font-bold">领券购买</span>
                 </div>
             </div>
        </div>

      </div>

      <button 
        onClick={handleDownload}
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg font-medium"
      >
        <Download size={20} />
        Download Image
      </button>
    </div>
  );
};
