import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationResult, PackageType } from '../types';
import { formatCurrency } from '../utils/calculator';
import GeminiAdvisor from './GeminiAdvisor';
import { PACKAGE_LABELS } from '../constants';

interface ResultsViewProps {
  result: CalculationResult;
  comparisonResults: Record<PackageType, CalculationResult>;
  currentPackage: PackageType;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ResultsView: React.FC<ResultsViewProps> = ({ result, comparisonResults, currentPackage }) => {
  const chartData = result.breakdown.map((item) => ({
    name: item.name,
    value: item.convertedArea,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Bảng Dự Toán Chi Phí
      </h2>

      {/* Package Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[PackageType.FULL_AVERAGE, PackageType.FULL_GOOD, PackageType.FULL_PREMIUM].map((pkgType) => {
          const res = comparisonResults[pkgType];
          const isSelected = currentPackage === pkgType;

          return (
            <div
              key={pkgType}
              className={`relative rounded-xl border-2 p-4 transition-all ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105 z-10'
                  : 'border-slate-100 bg-white hover:border-blue-200'
                }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  ĐANG CHỌN
                </div>
              )}
              <div className="text-sm font-medium text-slate-500 mb-1">
                {PACKAGE_LABELS[pkgType]}
              </div>
              <div className="text-xl font-bold text-slate-800 mb-2">
                {formatCurrency(res.totalCost)}
              </div>
              <div className="text-xs text-slate-400">
                {formatCurrency(res.unitPrice)}/m²
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Total (Active Package) */}
      <div className="bg-slate-900 rounded-xl p-6 text-center text-white mb-6 shadow-lg">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">
          Chi Phí {PACKAGE_LABELS[currentPackage]}
        </p>
        <div className="text-3xl md:text-4xl font-extrabold text-green-400">
          {formatCurrency(result.totalCost)}
        </div>
        <div className="mt-2 text-xs md:text-sm text-slate-400 flex justify-center gap-4">
          <span>Tổng diện tích quy đổi: <span className="text-white font-bold">{result.totalConvertedArea.toLocaleString('vi-VN')} m²</span></span>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Hạng mục</th>
              <th className="px-4 py-3 text-right">Diện tích sàn</th>
              <th className="px-4 py-3 text-center">Hệ số</th>
              <th className="px-4 py-3 text-right">DT Quy đổi</th>
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.name}
                  <div className="text-xs text-slate-400 font-normal">{item.description}</div>
                </td>
                <td className="px-4 py-3 text-right">{item.area.toLocaleString('vi-VN')} m²</td>
                <td className="px-4 py-3 text-center">{(item.coefficient * 100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800">{item.convertedArea.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} m²</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-bold text-slate-800">
            <tr>
              <td className="px-4 py-3" colSpan={3}>Tổng cộng</td>
              <td className="px-4 py-3 text-right">{result.totalConvertedArea.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} m²</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Charts & Gemini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="h-64 border rounded-xl p-2 relative">
          <h3 className="text-xs font-semibold text-slate-500 absolute top-3 left-3">Cơ cấu diện tích</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} m²`} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gemini Advisor Integration */}
        <GeminiAdvisor result={result} />
      </div>

    </div>
  );
};

export default ResultsView;