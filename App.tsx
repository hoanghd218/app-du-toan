import React, { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import { BasementDepth, FoundationType, HouseConfig, PackageType, RoofType } from './types';
import { calculateCost } from './utils/calculator';
import { BASEMENT_DEFAULT_PERCENTS, FLOORS_DEFAULT_PERCENT, FOUNDATION_DEFAULT_PERCENTS, ROOF_DEFAULT_PERCENTS, TERRACE_DEFAULT_PERCENT, UNIT_PRICES } from './constants';

// Default config
const INITIAL_CONFIG: HouseConfig = {
  width: 5,
  length: 12,
  floors: 2,
  foundationType: FoundationType.SINGLE,
  roofType: RoofType.CONCRETE,
  hasBasement: false,
  basementDepth: BasementDepth.DEPTH_10_13,
  hasTerrace: false,
  packageType: PackageType.FULL_AVERAGE,
  unitPrice: UNIT_PRICES[PackageType.FULL_AVERAGE], // Initialize with default package price
  coefficients: {
    foundation: FOUNDATION_DEFAULT_PERCENTS[FoundationType.SINGLE],
    basement: BASEMENT_DEFAULT_PERCENTS[BasementDepth.DEPTH_10_13],
    floors: FLOORS_DEFAULT_PERCENT,
    roof: ROOF_DEFAULT_PERCENTS[RoofType.CONCRETE],
    terrace: TERRACE_DEFAULT_PERCENT,
  }
};

function App() {
  const [config, setConfig] = useState<HouseConfig>(INITIAL_CONFIG);

  const result = useMemo(() => calculateCost(config), [config]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-800 leading-none">Xây Dựng Pro</h1>
               <span className="text-xs text-slate-500">Công cụ tính toán chi phí chính xác</span>
             </div>
          </div>
          <div className="hidden md:block text-sm text-slate-500">
             Cập nhật đơn giá thị trường 2024
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 xl:col-span-4">
             <InputForm config={config} onChange={setConfig} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ResultsView result={result} />
          </div>

        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-900 rounded-2xl p-8 text-slate-300">
           <h3 className="text-white text-lg font-bold mb-4">Lưu ý về công thức tính</h3>
           <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <p className="mb-2"><strong className="text-white">Công thức chính:</strong> Tổng chi phí = Tổng diện tích xây dựng (quy đổi) × Đơn giá xây dựng.</p>
                <p>Diện tích quy đổi bao gồm diện tích sàn sử dụng cộng với các phần phụ (móng, mái, sân thượng) nhân với hệ số % tương ứng.</p>
              </div>
              <div>
                 <ul className="list-disc list-inside space-y-1">
                    <li>Đơn giá trên chưa bao gồm thuế VAT.</li>
                    <li>Chi phí thực tế có thể thay đổi tùy thuộc vào vị trí địa lý, điều kiện thi công (hẻm nhỏ, đất yếu).</li>
                    <li>Nên tham khảo ít nhất 3 nhà thầu để có báo giá chính xác nhất.</li>
                 </ul>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;