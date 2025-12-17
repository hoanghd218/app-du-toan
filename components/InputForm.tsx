import React from 'react';
import { BasementDepth, FoundationType, HouseConfig, PackageType, RoofType } from '../types';
import {
  BASEMENT_DEFAULT_PERCENTS,
  BASEMENT_LABELS,
  FOUNDATION_DEFAULT_PERCENTS,
  FOUNDATION_LABELS,
  PACKAGE_LABELS,
  ROOF_DEFAULT_PERCENTS,
  ROOF_LABELS,
  UNIT_PRICES
} from '../constants';

interface InputFormProps {
  config: HouseConfig;
  onChange: (newConfig: HouseConfig) => void;
}

const InputForm: React.FC<InputFormProps> = ({ config, onChange }) => {

  const updateConfig = (updates: Partial<HouseConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleFoundationChange = (type: FoundationType) => {
    updateConfig({
      foundationType: type,
      coefficients: {
        ...config.coefficients,
        foundation: FOUNDATION_DEFAULT_PERCENTS[type]
      }
    });
  };

  const handleRoofChange = (type: RoofType) => {
    updateConfig({
      roofType: type,
      coefficients: {
        ...config.coefficients,
        roof: ROOF_DEFAULT_PERCENTS[type]
      }
    });
  };

  const handleBasementDepthChange = (depth: BasementDepth) => {
    updateConfig({
      basementDepth: depth,
      coefficients: {
        ...config.coefficients,
        basement: BASEMENT_DEFAULT_PERCENTS[depth]
      }
    });
  };

  const handleCoefficientChange = (key: keyof HouseConfig['coefficients'], value: number) => {
    updateConfig({
      coefficients: {
        ...config.coefficients,
        [key]: value
      }
    });
  };

  const handlePackageChange = (type: PackageType) => {
    updateConfig({
      packageType: type,
      unitPrice: config.packagePrices[type] // Use stored price for this package
    });
  };

  const handlePriceChange = (value: number) => {
    updateConfig({
      unitPrice: value,
      packagePrices: {
        ...config.packagePrices,
        [config.packageType]: value
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Thông Tin Công Trình
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chiều rộng (m)</label>
            <input
              type="number"
              min="1"
              value={config.width}
              onChange={(e) => updateConfig({ width: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chiều dài (m)</label>
            <input
              type="number"
              min="1"
              value={config.length}
              onChange={(e) => updateConfig({ length: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Floors */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
            <span>Số tầng (bao gồm trệt)</span>
            <span className="text-xs text-blue-600 font-semibold cursor-help" title="Hệ số sàn mặc định 100%">Hệ số: {config.coefficients.floors}%</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="10"
              value={config.floors}
              onChange={(e) => updateConfig({ floors: parseInt(e.target.value) })}
              className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-lg font-bold text-blue-600 w-8 text-center">{config.floors}</span>
          </div>
        </div>

        {/* Foundation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Móng</label>
          <div className="flex space-x-2">
            <select
              value={config.foundationType}
              onChange={(e) => handleFoundationChange(e.target.value as FoundationType)}
              className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {Object.entries(FOUNDATION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <div className="relative w-24">
              <input
                type="number"
                value={config.coefficients.foundation}
                onChange={(e) => handleCoefficientChange('foundation', parseFloat(e.target.value))}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center font-semibold text-slate-700"
              />
              <span className="absolute right-2 top-2 text-slate-400 text-sm">%</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gợi ý: Đơn (30-40%), Cọc (40-50%), Băng (50-70%)
          </p>
        </div>

        {/* Basement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasBasement}
                onChange={(e) => updateConfig({ hasBasement: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">Tầng Hầm</span>
            </label>
          </div>

          {config.hasBasement && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Độ sâu hầm</label>
                <select
                  value={config.basementDepth}
                  onChange={(e) => handleBasementDepthChange(e.target.value as BasementDepth)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(BASEMENT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Hệ số tính (%)</label>
                <input
                  type="number"
                  value={config.coefficients.basement}
                  onChange={(e) => handleCoefficientChange('basement', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Terrace */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.hasTerrace}
                onChange={(e) => updateConfig({ hasTerrace: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">Sân Thượng</span>
            </label>

            {config.hasTerrace && (
              <div className="relative w-24">
                <input
                  type="number"
                  value={config.coefficients.terrace}
                  onChange={(e) => handleCoefficientChange('terrace', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center font-semibold text-sm"
                />
                <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
              </div>
            )}
          </div>
          {config.hasTerrace && (
            <p className="text-xs text-slate-500 pl-7">Gợi ý: 40-50%, có giàn: 60-70%</p>
          )}
        </div>

        {/* Roof */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mái</label>
          <div className="flex space-x-2">
            <select
              value={config.roofType}
              onChange={(e) => handleRoofChange(e.target.value as RoofType)}
              className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {Object.entries(ROOF_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <div className="relative w-24">
              <input
                type="number"
                value={config.coefficients.roof}
                onChange={(e) => handleCoefficientChange('roof', parseFloat(e.target.value))}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center font-semibold text-slate-700"
              />
              <span className="absolute right-2 top-2 text-slate-400 text-sm">%</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gợi ý: Tole (30%), BTCT (50%), Kèo sắt (70%), Ngói (100%)
          </p>
        </div>

        {/* Package Selection */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-sm font-bold text-slate-800">Gói Thầu Xây Dựng</label>
            <div className="text-right w-1/2">
              <label className="text-xs text-slate-500 mb-1 block">Đơn giá áp dụng (VNĐ/m²)</label>
              <input
                type="number"
                value={config.unitPrice}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border border-blue-300 rounded bg-blue-50 text-right font-bold text-blue-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(PACKAGE_LABELS).map(([key, label]) => (
              <label
                key={key}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${config.packageType === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <input
                  type="radio"
                  name="packageType"
                  value={key}
                  checked={config.packageType === key}
                  onChange={() => handlePackageChange(key as PackageType)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm font-medium">
                  {label} <span className="text-slate-500 font-normal">
                    ({(config.packagePrices[key as PackageType] / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}tr/m²)
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;