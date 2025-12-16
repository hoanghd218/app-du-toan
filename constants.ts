import { BasementDepth, FoundationType, PackageType, RoofType } from './types';

// Default Coefficients (Percentage as integer)
// Updated based on image:
// Móng đơn: 30-40% -> Default 40
// Móng cọc: 40-50% -> Default 50
// Móng băng: 50-70% -> Default 60
export const FOUNDATION_DEFAULT_PERCENTS: Record<FoundationType, number> = {
  [FoundationType.SINGLE]: 40,
  [FoundationType.STRIP]: 60, 
  [FoundationType.PILE]: 50,
  [FoundationType.RAFT]: 100,
};

// Mái tole: 30-40% -> Default 30
// Mái BTCT: 40-50% -> Default 50
// Mái vì kèo sắt: 60-70% -> Default 70
// Mái BTCT + ngói: 90-100% -> Default 100
export const ROOF_DEFAULT_PERCENTS: Record<RoofType, number> = {
  [RoofType.CONCRETE]: 50,
  [RoofType.TILE_TRUSS]: 70,
  [RoofType.TILE_CONCRETE]: 100,
  [RoofType.CORRUGATED_IRON]: 30,
  [RoofType.NONE]: 0,
};

// Tầng hầm
// 1.0-1.3m: 120-130% -> 130
// 1.3-1.5m: 140-150% -> 150
// 1.5-1.8m: 170-180% -> 180
// 1.8-2.2m: 200-210% -> 210
export const BASEMENT_DEFAULT_PERCENTS: Record<BasementDepth, number> = {
  [BasementDepth.DEPTH_10_13]: 130,
  [BasementDepth.DEPTH_13_15]: 150,
  [BasementDepth.DEPTH_15_18]: 180,
  [BasementDepth.DEPTH_18_22]: 210,
};

export const TERRACE_DEFAULT_PERCENT = 50; // Image says 40-50%
export const FLOORS_DEFAULT_PERCENT = 100; // Image says 100%

// Đơn giá xây dựng (Unit Prices - VNĐ/m2)
export const UNIT_PRICES: Record<PackageType, number> = {
  [PackageType.ROUGH]: 3500000,
  [PackageType.FULL_AVERAGE]: 4750000,
  [PackageType.FULL_GOOD]: 5500000,
  [PackageType.FULL_PREMIUM]: 6500000,
};

// Labels for UI
export const FOUNDATION_LABELS: Record<FoundationType, string> = {
  [FoundationType.SINGLE]: 'Móng đơn',
  [FoundationType.PILE]: 'Móng cọc',
  [FoundationType.STRIP]: 'Móng băng',
  [FoundationType.RAFT]: 'Móng bè',
};

export const ROOF_LABELS: Record<RoofType, string> = {
  [RoofType.CORRUGATED_IRON]: 'Mái tôn',
  [RoofType.CONCRETE]: 'Mái BTCT',
  [RoofType.TILE_TRUSS]: 'Mái ngói kèo sắt',
  [RoofType.TILE_CONCRETE]: 'Mái ngói BTCT',
  [RoofType.NONE]: 'Không làm mái',
};

export const BASEMENT_LABELS: Record<BasementDepth, string> = {
  [BasementDepth.DEPTH_10_13]: 'Sâu 1.0m - 1.3m',
  [BasementDepth.DEPTH_13_15]: 'Sâu 1.3m - 1.5m',
  [BasementDepth.DEPTH_15_18]: 'Sâu 1.5m - 1.8m',
  [BasementDepth.DEPTH_18_22]: 'Sâu 1.8m - 2.2m',
};

export const PACKAGE_LABELS: Record<PackageType, string> = {
  [PackageType.ROUGH]: 'Xây thô (3.5tr/m2)',
  [PackageType.FULL_AVERAGE]: 'Trọn gói - Trung bình (4.75tr/m2)',
  [PackageType.FULL_GOOD]: 'Trọn gói - Khá (5.5tr/m2)',
  [PackageType.FULL_PREMIUM]: 'Trọn gói - Cao cấp (6.5tr/m2)',
};