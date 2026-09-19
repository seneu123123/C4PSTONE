export type SupportedCurrency = 'PHP' | 'USD' | 'HKD' | 'JPY' | 'KRW' | 'SGD' | 'EUR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  rateToPhp: number; // 1 unit of foreign currency = X PHP
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭', rateToPhp: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateToPhp: 56.5 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰', rateToPhp: 7.25 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rateToPhp: 0.38 },
  KRW: { code: 'KRW', symbol: '₩', name: 'Korean Won', flag: '🇰🇷', rateToPhp: 0.042 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rateToPhp: 42.8 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateToPhp: 61.2 },
};

/**
 * Format PHP price into target currency string
 */
export function formatCurrency(
  amountInPhp: number, 
  targetCurrency: SupportedCurrency = 'PHP',
  customRates?: Record<SupportedCurrency, number>
): string {
  if (isNaN(amountInPhp) || amountInPhp === null || amountInPhp === undefined) {
    return '₱0';
  }

  const currencyInfo = CURRENCIES[targetCurrency] || CURRENCIES.PHP;
  const rate = customRates?.[targetCurrency] || currencyInfo.rateToPhp;
  const convertedAmount = targetCurrency === 'PHP' ? amountInPhp : amountInPhp / rate;

  if (targetCurrency === 'JPY' || targetCurrency === 'KRW') {
    return `${currencyInfo.symbol}${Math.round(convertedAmount).toLocaleString()}`;
  }

  const numDigits = targetCurrency === 'PHP' && convertedAmount % 1 === 0 ? 0 : 2;

  return `${currencyInfo.symbol}${convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: numDigits,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Fetch live exchange rates from open API with local resilient fallback
 */
export async function fetchLiveExchangeRates(): Promise<Record<SupportedCurrency, number>> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/PHP');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return {
          PHP: 1,
          USD: data.rates.USD ? 1 / data.rates.USD : CURRENCIES.USD.rateToPhp,
          HKD: data.rates.HKD ? 1 / data.rates.HKD : CURRENCIES.HKD.rateToPhp,
          JPY: data.rates.JPY ? 1 / data.rates.JPY : CURRENCIES.JPY.rateToPhp,
          KRW: data.rates.KRW ? 1 / data.rates.KRW : CURRENCIES.KRW.rateToPhp,
          SGD: data.rates.SGD ? 1 / data.rates.SGD : CURRENCIES.SGD.rateToPhp,
          EUR: data.rates.EUR ? 1 / data.rates.EUR : CURRENCIES.EUR.rateToPhp,
        };
      }
    }
  } catch (err) {
    console.warn('Live currency API fallback to default rates:', err);
  }
  return {
    PHP: 1,
    USD: CURRENCIES.USD.rateToPhp,
    HKD: CURRENCIES.HKD.rateToPhp,
    JPY: CURRENCIES.JPY.rateToPhp,
    KRW: CURRENCIES.KRW.rateToPhp,
    SGD: CURRENCIES.SGD.rateToPhp,
    EUR: CURRENCIES.EUR.rateToPhp,
  };
}

/**
 * Get cached selected currency code
 */
export function getStoredCurrency(): SupportedCurrency {
  try {
    const cached = localStorage.getItem('holiday_selected_currency');
    if (cached && CURRENCIES[cached as SupportedCurrency]) {
      return cached as SupportedCurrency;
    }
  } catch {}
  return 'PHP';
}

/**
 * Save selected currency code & notify active components
 */
export function saveStoredCurrency(currency: SupportedCurrency): void {
  try {
    localStorage.setItem('holiday_selected_currency', currency);
    window.dispatchEvent(new CustomEvent('holiday_currency_changed', { detail: currency }));
  } catch {}
}
