/**
 * Client-side receipt and image compressor using Canvas.
 * Prevents QuotaExceededError in localStorage while maintaining high legibility for transaction reference audit.
 */

export const compressImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.72
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(readerEvent.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Returns a high-fidelity mock Philippine GCash / InstaPay receipt SVG data URL for instant QA testing.
 */
export const getSampleGCashReceipt = (refNo: string, amount: number, senderName: string = 'Guest Passenger'): string => {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 620" width="380" height="620">
    <rect width="380" height="620" rx="24" fill="#005CE6"/>
    <!-- Header -->
    <rect y="0" width="380" height="110" fill="#005CE6"/>
    <text x="190" y="52" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">Express Send</text>
    <text x="190" y="78" fill="#E0ECFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" text-anchor="middle">Payment to Merchant</text>

    <!-- White Slip Card -->
    <g transform="translate(20, 96)">
      <rect width="340" height="495" rx="18" fill="#FFFFFF"/>
      
      <!-- Success Icon -->
      <circle cx="170" cy="48" r="28" fill="#00B050"/>
      <path d="M158 48 l9 9 l16 -16" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

      <text x="170" y="104" fill="#1C1C1E" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Payment Sent Successfully</text>
      <text x="170" y="140" fill="#005CE6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="bold" text-anchor="middle">₱${amount.toLocaleString()}.00</text>
      <text x="170" y="162" fill="#8E8E93" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" text-anchor="middle">${dateStr} • ${timeStr}</text>

      <line x1="20" y1="184" x2="320" y2="184" stroke="#E5E5EA" stroke-dasharray="4 4" stroke-width="1.5"/>

      <!-- Details -->
      <text x="24" y="215" fill="#8E8E93" font-family="sans-serif" font-size="11">Sent To</text>
      <text x="316" y="215" fill="#1C1C1E" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end">KARLL GENESIS JACOB</text>

      <text x="24" y="248" fill="#8E8E93" font-family="sans-serif" font-size="11">Mobile Number</text>
      <text x="316" y="248" fill="#1C1C1E" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="end">0992 025 3041</text>

      <text x="24" y="281" fill="#8E8E93" font-family="sans-serif" font-size="11">Sender Name</text>
      <text x="316" y="281" fill="#1C1C1E" font-family="sans-serif" font-size="12" font-weight="500" text-anchor="end">${senderName.slice(0, 22)}</text>

      <text x="24" y="314" fill="#8E8E93" font-family="sans-serif" font-size="11">Payment Network</text>
      <text x="316" y="314" fill="#1C1C1E" font-family="sans-serif" font-size="12" font-weight="600" text-anchor="end">InstaPay / GCash QR Ph</text>

      <line x1="20" y1="340" x2="320" y2="340" stroke="#E5E5EA" stroke-width="1"/>

      <text x="24" y="375" fill="#8E8E93" font-family="sans-serif" font-size="11">Reference No.</text>
      <rect x="18" y="386" width="304" height="42" rx="8" fill="#F2F2F7"/>
      <text x="170" y="413" fill="#005CE6" font-family="Courier, monospace" font-size="15" font-weight="bold" text-anchor="middle">${refNo}</text>

      <!-- Watermark Anti-Fraud -->
      <text x="170" y="462" fill="#00B050" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">OFFICIAL CLIENT PROOF SLIP • MANUAL AUDIT QUEUE</text>
      <text x="170" y="478" fill="#AEAEB2" font-family="sans-serif" font-size="9" text-anchor="middle">Holiday Travelers Travel and Tours Inc. Finance Dept</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
