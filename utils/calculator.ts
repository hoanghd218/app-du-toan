import { 
  BASEMENT_LABELS,
  FOUNDATION_LABELS,
  ROOF_LABELS
} from '../constants';
import { CalculationResult, CostBreakdownItem, HouseConfig } from '../types';

export const calculateCost = (config: HouseConfig): CalculationResult => {
  const baseArea = config.width * config.length;
  const breakdown: CostBreakdownItem[] = [];

  // 1. Móng (Foundation)
  const foundationCoeff = config.coefficients.foundation / 100;
  const foundationArea = baseArea * foundationCoeff;
  breakdown.push({
    name: 'Móng',
    area: baseArea,
    coefficient: foundationCoeff,
    convertedArea: foundationArea,
    description: `${FOUNDATION_LABELS[config.foundationType]} (${config.coefficients.foundation}%)`
  });

  // 2. Tầng hầm (Basement - Optional)
  if (config.hasBasement) {
    const basementCoeff = config.coefficients.basement / 100;
    const basementArea = baseArea * basementCoeff;
    breakdown.push({
      name: 'Tầng hầm',
      area: baseArea,
      coefficient: basementCoeff,
      convertedArea: basementArea,
      description: `${BASEMENT_LABELS[config.basementDepth]} (${config.coefficients.basement}%)`
    });
  }

  // 3. Các tầng (Floors)
  // Assuming 'floors' input includes the Ground floor. 
  // Each floor uses the user configured coefficient (default 100%)
  const floorCoeff = config.coefficients.floors / 100;
  const floorsArea = baseArea * config.floors; 
  const floorsConverted = floorsArea * floorCoeff;
  
  breakdown.push({
    name: `Các tầng (x${config.floors})`,
    area: floorsArea,
    coefficient: floorCoeff,
    convertedArea: floorsConverted, 
    description: `${config.coefficients.floors}% diện tích sàn`
  });

  // 4. Sân thượng (Terrace - Optional)
  if (config.hasTerrace) {
    const terraceCoeff = config.coefficients.terrace / 100;
    const terraceArea = baseArea * terraceCoeff;
    breakdown.push({
      name: 'Sân thượng',
      area: baseArea,
      coefficient: terraceCoeff,
      convertedArea: terraceArea,
      description: `Hệ số ${config.coefficients.terrace}%`
    });
  }

  // 5. Mái (Roof)
  const roofCoeff = config.coefficients.roof / 100;
  const roofArea = baseArea * roofCoeff;
  breakdown.push({
    name: 'Mái',
    area: baseArea,
    coefficient: roofCoeff,
    convertedArea: roofArea,
    description: `${ROOF_LABELS[config.roofType]} (${config.coefficients.roof}%)`
  });

  // Totals
  const totalConvertedArea = breakdown.reduce((sum, item) => sum + item.convertedArea, 0);
  
  // Use the editable unit price from config
  const unitPrice = config.unitPrice;
  const totalCost = totalConvertedArea * unitPrice;

  return {
    baseArea,
    totalConvertedArea,
    unitPrice,
    totalCost,
    breakdown
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};