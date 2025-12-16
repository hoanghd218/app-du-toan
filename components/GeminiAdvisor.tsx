import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculator';

interface GeminiAdvisorProps {
  result: CalculationResult;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ result }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetAdvice = async () => {
    if (!process.env.API_KEY) {
      setError("API Key chưa được cấu hình.");
      return;
    }

    setLoading(true);
    setError('');
    setAdvice('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Bạn là một chuyên gia tư vấn xây dựng Việt Nam. Hãy phân tích bảng dự toán sơ bộ này và đưa ra nhận xét ngắn gọn (dưới 150 từ):
        
        Thông số:
        - Tổng diện tích quy đổi: ${result.totalConvertedArea} m2
        - Đơn giá: ${formatCurrency(result.unitPrice)} / m2
        - Tổng chi phí: ${formatCurrency(result.totalCost)}
        
        Chi tiết:
        ${result.breakdown.map(b => `- ${b.name}: ${b.convertedArea} m2 (${b.description})`).join('\n')}
        
        Hãy nhận xét về:
        1. Tính hợp lý của chi phí so với thị trường hiện nay.
        2. Một vài lưu ý quan trọng cho chủ nhà khi làm việc với thầu dựa trên quy mô này.
        Dùng định dạng Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAdvice(response.text || "Không có phản hồi từ AI.");
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi kết nối với chuyên gia AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-64 border border-blue-100 bg-blue-50 rounded-xl p-4 flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Tư vấn AI
         </h3>
         {!advice && !loading && (
             <button 
                onClick={handleGetAdvice}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
             >
                Phân tích ngay
             </button>
         )}
      </div>

      <div className="flex-grow overflow-y-auto text-sm text-slate-700 custom-scrollbar">
        {loading && (
            <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-500">Đang phân tích dữ liệu...</span>
            </div>
        )}
        
        {error && <p className="text-red-500 text-xs">{error}</p>}
        
        {!loading && !advice && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <p className="text-xs">Bấm nút để nhận đánh giá từ AI về tính hợp lý của dự toán này.</p>
            </div>
        )}

        {advice && (
           <div className="prose prose-sm prose-blue max-w-none">
             {/* Simple markdown rendering assumption or just whitespace preservation */}
             <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
           </div>
        )}
      </div>
      
      {advice && (
          <button 
            onClick={handleGetAdvice}
            className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow border hover:bg-slate-50 text-slate-400"
            title="Tải lại"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
      )}
    </div>
  );
};

export default GeminiAdvisor;