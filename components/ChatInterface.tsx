import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MoreHorizontal, Phone, Video } from 'lucide-react';
import { Message, ProductToolArgs } from '../types';
import { sendMessageToGemini, generateProductImage } from '../services/geminiService';

interface ChatInterfaceProps {
  onProductGenerated: (data: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onProductGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: '宝子！今天要买点啥？👗👠👜' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Tool call handler
    const handleToolCall = async (args: ProductToolArgs) => {
      // 1. Notify UI we are generating image
      setMessages(prev => [...prev, { 
        id: 'loading-img', 
        role: 'model', 
        text: '正在帮你找图片... 🎨', 
        isLoading: true 
      }]);

      // 2. Generate Image
      const base64Image = await generateProductImage(args.imagePrompt);

      // 3. Remove loading message
      setMessages(prev => prev.filter(m => m.id !== 'loading-img'));

      // 4. Update Parent
      onProductGenerated({
        title: args.productName,
        price: args.price.toString(),
        originalPrice: args.originalPrice.toString(),
        tags: args.tags || ['极速退款', '包邮'],
        imageUrl: base64Image,
        shopName: args.shopName,
        saleLabel: args.saleTag
      });
    };

    const replyText = await sendMessageToGemini(history, userMsg.text, handleToolCall);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: replyText,
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f2] w-full max-w-md mx-auto shadow-2xl rounded-[3rem] overflow-hidden border-8 border-gray-900 relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>

      {/* Header */}
      <div className="bg-[#ededed] px-4 pt-10 pb-3 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center gap-2 text-blue-500">
          <ArrowLeft size={22} />
          <span className="font-semibold text-black text-lg">最好的闺蜜 💖</span>
        </div>
        <div className="flex gap-4 text-blue-500">
            <Video size={24} />
            <Phone size={22} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <div className="text-center text-xs text-gray-400 my-2">Today 15:17</div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
               <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center mr-2 border border-pink-300 text-xs shrink-0 overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
               </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#95ec69] text-black'
                  : 'bg-white text-gray-800'
              } ${msg.isLoading ? 'animate-pulse' : ''}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && !messages.some(m => m.isLoading) && (
             <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center mr-2 border border-pink-300 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                 <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                     <div className="flex space-x-1">
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                     </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-[#f7f7f7] px-3 py-2 flex items-center gap-2 border-t border-gray-300 safe-area-pb">
        <div className="p-2 rounded-full bg-white border border-gray-300">
             <Video size={20} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-white border-none rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-400 text-base"
          placeholder="Send a message..."
        />
        <div className="p-2">
            <MoreHorizontal size={24} className="text-gray-500"/>
        </div>
        {inputText.length > 0 && (
            <button
            onClick={handleSend}
            className="bg-[#95ec69] p-2 rounded-full text-white hover:bg-[#85d65c] transition-colors"
            >
            <Send size={18} className="text-black ml-0.5" />
            </button>
        )}
      </div>
      
      {/* Home Indicator */}
      <div className="bg-[#f7f7f7] w-full h-6 flex justify-center items-center pb-2 rounded-b-[2.5rem]">
          <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
};
