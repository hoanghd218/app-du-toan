export enum FoundationType {
  SINGLE = 'SINGLE', // Móng đơn
  STRIP = 'STRIP',   // Móng băng
  PILE = 'PILE',     // Móng cọc
  RAFT = 'RAFT'      // Móng bè (Giữ lại cho đầy đủ)
}

export enum RoofType {
  CONCRETE = 'CONCRETE', // Mái BTCT
  TILE_TRUSS = 'TILE_TRUSS', // Mái ngói kèo sắt
  TILE_CONCRETE = 'TILE_CONCRETE', // Mái ngói BTCT
  CORRUGATED_IRON = 'CORRUGATED_IRON', // Mái tôn
  NONE = 'NONE'
}

export enum BasementDepth {
  DEPTH_10_13 = 'DEPTH_10_13', // 1.0m - 1.3m
  DEPTH_13_15 = 'DEPTH_13_15', // 1.3m - 1.5m
  DEPTH_15_18 = 'DEPTH_15_18', // 1.5m - 1.8m
  DEPTH_18_22 = 'DEPTH_18_22', // 1.8m - 2.2m
}

export enum PackageType {
  ROUGH = 'ROUGH',
  FULL_AVERAGE = 'FULL_AVERAGE',
  FULL_GOOD = 'FULL_GOOD',
  FULL_PREMIUM = 'FULL_PREMIUM'
}

export interface HouseConfig {
  width: number;
  length: number;
  floors: number;
  foundationType: FoundationType;
  roofType: RoofType;
  hasBasement: boolean;
  basementDepth: BasementDepth; // New: Depth selection
  hasTerrace: boolean;
  packageType: PackageType;
  unitPrice: number; // New: Manually editable unit price

  // New: Custom coefficients settings (percent as integer, e.g. 40 for 40%)
  coefficients: {
    foundation: number;
    basement: number;
    floors: number;
    roof: number;
    terrace: number;
  };
  packagePrices: Record<PackageType, number>; // New: Store custom prices for each package
}


export interface CostBreakdownItem {
  name: string;
  area: number;
  coefficient: number; // decimal
  convertedArea: number;
  description: string;
}

export interface CalculationResult {
  baseArea: number;
  totalConvertedArea: number;
  unitPrice: number;
  totalCost: number;
  breakdown: CostBreakdownItem[];
}