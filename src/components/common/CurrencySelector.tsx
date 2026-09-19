import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { 
  SupportedCurrency, 
  CURRENCIES, 
  getStoredCurrency, 
  saveStoredCurrency, 
  fetchLiveExchangeRates 
} from '../../utils/currency';

interface CurrencySelectorProps {
  currentCurrency?: SupportedCurrency;
  onChangeCurrency?: (currency: SupportedCurrency) => void;
  className?: string;
  variant?: 'pill' | 'compact' | 'full';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency: externalCurrency,
  onChangeCurrency,
  className = '',
  variant = 'pill'
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(
    externalCurrency || getStoredCurrency()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [rates, setRates] = useState<Record<SupportedCurrency, number>>({
    PHP: 1,
    USD: CURRENCIES.USD.rateToPhp,
    HKD: CURRENCIES.HKD.rateToPhp,
    JPY: CURRENCIES.JPY.rateToPhp,
    KRW: CURRENCIES.KRW.rateToPhp,
    SGD: CURRENCIES.SGD.rateToPhp,
    EUR: CURRENCIES.EUR.rateToPhp,
  });
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external prop if provided
  useEffect(() => {
    if (externalCurrency && externalCurrency !== selectedCurrency) {
      setSelectedCurrency(externalCurrency);
    }
  }, [externalCurrency]);

  // Listen for global custom events
  useEffect(() => {
    const handleCurrencyEvent = (e: Event) => {
      const custom = e as CustomEvent<SupportedCurrency>;
      if (custom.detail && CURRENCIES[custom.detail]) {
        setSelectedCurrency(custom.detail);
      }
    };
    window.addEventListener('holiday_currency_changed', handleCurrencyEvent);
    return () => window.removeEventListener('holiday_currency_changed', handleCurrencyEvent);
  }, []);

  // Fetch live exchange rates on mount
  useEffect(() => {
    let isMounted = true;
    setIsFetchingRates(true);
    fetchLiveExchangeRates()
      .then((liveRates) => {
        if (isMounted) {
          setRates(liveRates);
          setIsFetchingRates(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsFetchingRates(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedCurrency) => {
    setSelectedCurrency(code);
    saveStoredCurrency(code);
    if (onChangeCurrency) onChangeCurrency(code);
    setIsOpen(false);
  };

  const activeInfo = CURRENCIES[selectedCurrency] || CURRENCIES.PHP;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Selector Trigger Button */}
      {variant === 'pill' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-ivory text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95 group"
          title={`Display Prices in ${activeInfo.name} (${activeInfo.code})`}
          id="currency-selector-pill-btn"
        >
          <span className="text-sm">{activeInfo.flag}</span>
          <span className="font-bold text-sunset-coral">{activeInfo.code}</span>
          <span className="text-[10px] text-sand-muted">({activeInfo.symbol})</span>
          <ChevronDown className={`w-3 h-3 text-sand-muted group-hover:text-ivory transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {variant === 'compact' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-ivory text-[11px] font-mono transition-all cursor-pointer"
          title={`Active Currency: ${activeInfo.code}`}
          id="currency-selector-compact-btn"
        >
          <span>{activeInfo.flag}</span>
          <span className="font-semibold text-sunset-coral">{activeInfo.code}</span>
          <ChevronDown className={`w-3 h-3 text-sand-muted ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {variant === 'full' && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#070B0E] border border-white/15 text-ivory text-xs font-sans-body hover:border-sunset-coral/50 transition-all cursor-pointer"
          id="currency-selector-full-btn"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{activeInfo.flag}</span>
            <div className="text-left">
              <span className="font-bold text-ivory block">{activeInfo.name} ({activeInfo.code})</span>
              <span className="text-[10px] text-sand-muted font-mono block">
                {selectedCurrency === 'PHP' ? 'Base Agency Rate' : `1 ${selectedCurrency} ≈ ₱${rates[selectedCurrency]?.toFixed(2)}`}
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-sand-muted ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Currency Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#090E14] border border-white/15 shadow-2xl p-2 z-50 animate-scale-in">
          <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sand-muted flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-sunset-coral" />
              <span>Select Display Currency</span>
            </span>
            {isFetchingRates && (
              <RefreshCw className="w-3 h-3 text-sunset-coral animate-spin" />
            )}
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {Object.values(CURRENCIES).map((curr) => {
              const isSelected = selectedCurrency === curr.code;
              const rateVal = rates[curr.code];

              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sunset-coral/20 border border-sunset-coral/40 text-ivory font-medium'
                      : 'hover:bg-white/5 text-sand-muted hover:text-ivory border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{curr.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-ivory font-mono">{curr.code}</span>
                        <span className="text-[10px] text-sand-muted">({curr.symbol})</span>
                      </div>
                      <span className="text-[10px] text-sand-muted/80 block truncate max-w-[120px] font-sans-body">
                        {curr.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    {curr.code !== 'PHP' && rateVal && (
                      <span className="text-[10px] font-mono text-cyan-300/80">
                        ≈ ₱{rateVal < 1 ? rateVal.toFixed(3) : rateVal.toFixed(1)}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-4 h-4 text-sunset-coral shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 mt-2 pt-2 px-3 pb-1">
            <p className="text-[9px] text-sand-muted font-mono leading-tight">
              Rates updated live via European Central Bank feed. Official booking checkout invoices remain payable in PHP ₱.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
