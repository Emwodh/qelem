export interface PlatformSettings {
  // Banking & Telebirr Payment Details
  cbeAccountNumber: string;
  cbeAccountName: string;
  cbeBranch: string;
  telebirrPhone: string;
  telebirrMerchantName: string;
  
  // Pricing Strategy (ETB)
  matricSeasonPassPriceETB: number;
  monthlyPassPriceETB: number;
  
  // Platform & Exam Hall Operations
  maintenanceMode: boolean;
  strictExamHallLockdown: boolean;
  aiTutorDailyLimit: number;
  allowOfflineCaches: boolean;
  
  // Security
  adminSessionTimeoutMinutes: number;
}

const SETTINGS_STORAGE_KEY = "qelem_platform_settings";

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  cbeAccountNumber: "1000123456789",
  cbeAccountName: "Qelem Education Prep Services",
  cbeBranch: "Addis Ababa Finfine / Bole Main Branch",
  telebirrPhone: "+251911223344",
  telebirrMerchantName: "Qelem EdTech / Telebirr Pay",
  
  matricSeasonPassPriceETB: 349,
  monthlyPassPriceETB: 149,
  
  maintenanceMode: false,
  strictExamHallLockdown: true,
  aiTutorDailyLimit: 25,
  allowOfflineCaches: true,
  
  adminSessionTimeoutMinutes: 120,
};

export function getPlatformSettings(): PlatformSettings {
  if (typeof window === "undefined") return DEFAULT_PLATFORM_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_PLATFORM_SETTINGS));
      return DEFAULT_PLATFORM_SETTINGS;
    }
    return { ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

export function savePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  if (typeof window === "undefined") return { ...DEFAULT_PLATFORM_SETTINGS, ...updates };
  try {
    const current = getPlatformSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save platform settings:", err);
    return { ...DEFAULT_PLATFORM_SETTINGS, ...updates };
  }
}

export function resetPlatformSettings(): PlatformSettings {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_PLATFORM_SETTINGS));
    } catch (err) {
      console.error("Failed to reset settings:", err);
    }
  }
  return DEFAULT_PLATFORM_SETTINGS;
}
