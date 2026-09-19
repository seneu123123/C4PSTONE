import React from 'react';

export type StampType = 'PAID' | 'UNPAID' | 'PENDING' | 'PARTIAL' | 'VERIFIED' | 'CANCELLED';

interface RubberStampProps {
  type: StampType;
  subtext?: string;
  date?: string;
  verificationCode?: string;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number; // degrees, defaults to -10
  className?: string;
}

export const RubberStamp: React.FC<RubberStampProps> = ({
  type,
  subtext,
  date,
  verificationCode,
  size = 'md',
  rotation = -10,
  className = ''
}) => {
  // Config per stamp type
  const config = {
    PAID: {
      text: 'PAID IN FULL',
      sub: subtext || 'FINANCE AUDIT PASSED',
      colorClasses: 'text-emerald-500 border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20',
      printClasses: 'print:text-emerald-700 print:border-emerald-700 print:bg-emerald-50',
      starColor: 'text-emerald-400',
    },
    VERIFIED: {
      text: 'VERIFIED & CLEARED',
      sub: subtext || 'OFFICIAL BOOKING RELEASE',
      colorClasses: 'text-emerald-500 border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20',
      printClasses: 'print:text-emerald-700 print:border-emerald-700 print:bg-emerald-50',
      starColor: 'text-emerald-400',
    },
    PARTIAL: {
      text: 'DEPOSIT PAID',
      sub: subtext || '50% CONFIRMED • BALANCE AT BRIEFING',
      colorClasses: 'text-amber-500 border-amber-500 bg-amber-500/10 shadow-amber-500/20',
      printClasses: 'print:text-amber-700 print:border-amber-700 print:bg-amber-50',
      starColor: 'text-amber-400',
    },
    UNPAID: {
      text: 'UNPAID',
      sub: subtext || 'PAYMENT REQUIRED TO CONFIRM',
      colorClasses: 'text-rose-500 border-rose-500 bg-rose-500/10 shadow-rose-500/20',
      printClasses: 'print:text-rose-700 print:border-rose-700 print:bg-rose-50',
      starColor: 'text-rose-400',
    },
    PENDING: {
      text: 'PENDING AUDIT',
      sub: subtext || 'RECEIPT UNDER MANUAL REVIEW',
      colorClasses: 'text-rose-500 border-rose-500 bg-rose-500/10 shadow-rose-500/20',
      printClasses: 'print:text-rose-700 print:border-rose-700 print:bg-rose-50',
      starColor: 'text-rose-400',
    },
    CANCELLED: {
      text: 'VOID / CANCELLED',
      sub: subtext || 'SLOT RELEASED',
      colorClasses: 'text-slate-400 border-slate-500 bg-slate-500/10 shadow-slate-500/20',
      printClasses: 'print:text-slate-700 print:border-slate-700 print:bg-slate-100',
      starColor: 'text-slate-400',
    }
  }[type];

  // Sizing styles
  const sizeStyles = {
    sm: {
      wrapper: 'px-3 py-1.5 border-[2.5px] rounded-lg',
      innerBorder: 'border-[1px] px-2 py-0.5 rounded-[4px]',
      mainText: 'text-xs tracking-widest font-black',
      subText: 'text-[8px] tracking-wider',
      stars: 'text-[9px]',
    },
    md: {
      wrapper: 'px-4 py-2 border-[3.5px] rounded-xl shadow-lg',
      innerBorder: 'border-[1.5px] px-3 py-1 rounded-md',
      mainText: 'text-base sm:text-lg tracking-widest font-black',
      subText: 'text-[9px] sm:text-[10px] tracking-wider',
      stars: 'text-xs',
    },
    lg: {
      wrapper: 'px-6 py-3 border-[4.5px] rounded-2xl shadow-xl',
      innerBorder: 'border-[2px] px-4 py-1.5 rounded-lg',
      mainText: 'text-xl sm:text-2xl tracking-[0.25em] font-black',
      subText: 'text-xs tracking-widest',
      stars: 'text-sm',
    }
  }[size];

  const currentDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <div 
      className={`inline-block select-none pointer-events-none transition-transform duration-300 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={`Official Stamp: ${config.text}`}
    >
      <div 
        className={`relative ${sizeStyles.wrapper} ${config.colorClasses} ${config.printClasses} backdrop-blur-xs flex flex-col items-center justify-center font-mono uppercase text-center border-dashed`}
      >
        {/* Inner thin border frame */}
        <div className={`w-full h-full ${sizeStyles.innerBorder} border-current flex flex-col items-center justify-center space-y-0.5`}>
          {/* Header stars & Agency mark */}
          <div className="flex items-center gap-1.5 leading-none opacity-90">
            <span className={sizeStyles.stars}>★</span>
            <span className="text-[7.5px] tracking-widest font-bold">HOLIDAY TRAVELERS INC.</span>
            <span className={sizeStyles.stars}>★</span>
          </div>

          {/* Main Stamp Text */}
          <span className={`${sizeStyles.mainText} leading-tight block drop-shadow-sm font-sans uppercase font-extrabold`}>
            {config.text}
          </span>

          {/* Subtext and Date */}
          <div className="flex items-center gap-2 text-center opacity-90 leading-tight">
            <span className={`${sizeStyles.subText} font-semibold font-mono`}>
              {config.sub}
            </span>
            <span className="text-[8px] opacity-75 font-mono">• {currentDate}</span>
          </div>

          {verificationCode && (
            <span className="text-[7px] font-mono tracking-widest opacity-80 mt-0.5">
              AUTH REF: {verificationCode}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
