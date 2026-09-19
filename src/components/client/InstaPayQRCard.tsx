import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  UploadCloud, 
  AlertCircle, 
  Maximize2, 
  X, 
  FileCheck,
  Lock,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { dispatchAppNotification } from '../../utils/notifications';
import { compressImageFile, getSampleGCashReceipt } from '../../utils/imageCompressor';

interface InstaPayQRCardProps {
  amountDue: number;
  paymentOption: 'deposit' | 'full';
  referenceNo: string;
  onReferenceNoChange: (val: string) => void;
  receiptProofUrl: string;
  onReceiptProofChange: (fileUrl: string) => void;
}

export const InstaPayQRCard: React.FC<InstaPayQRCardProps> = ({
  amountDue,
  paymentOption,
  referenceNo,
  onReferenceNoChange,
  receiptProofUrl,
  onReceiptProofChange
}) => {
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isReceiptZoomOpen, setIsReceiptZoomOpen] = useState(false);

  const GCASH_NUMBER = '09920253041';
  const ACCOUNT_NAME = 'KARLL GENESIS JACOB';
  const QR_IMAGE_URL = '/images/instapay-qr-card.svg';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(GCASH_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amountDue.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2200);
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(ACCOUNT_NAME);
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 2200);
  };

  const handleDownloadQR = () => {
    const a = document.createElement('a');
    a.href = QR_IMAGE_URL;
    a.download = `HolidayTravelers-InstaPay-QR-${GCASH_NUMBER}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Upload proof of payment with client-side canvas compression to prevent localStorage overflow
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.75);
      if (compressedDataUrl) {
        onReceiptProofChange(compressedDataUrl);

        // Dispatch real-time notification to user and staff
        dispatchAppNotification({
          title: 'Proof of Payment Attached',
          message: 'Receipt photo uploaded. Reference queued for manual ledger audit by Finance Officer.',
          type: 'receipt'
        });
      }
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAttachMockSample = () => {
    const mockRef = referenceNo.trim() || `GC-${Math.floor(100000000 + Math.random() * 900000000)}`;
    if (!referenceNo.trim()) {
      onReferenceNoChange(mockRef);
    }
    const sampleReceipt = getSampleGCashReceipt(mockRef, amountDue, 'Guest Passenger');
    onReceiptProofChange(sampleReceipt);
    dispatchAppNotification({
      title: 'Sample Receipt Attached',
      message: `QA Test Receipt attached with Ref No. ${mockRef}. Ready for manual audit.`,
      type: 'receipt'
    });
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout: Left is Contained Authentic QR Card, Right is Account Details & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Authentic InstaPay QR Image (Clean, Contained, No Field Overlapping) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[290px] sm:max-w-[310px] bg-[#0066FF] p-2.5 sm:p-3 rounded-3xl shadow-2xl border border-blue-400/40 relative group overflow-hidden">
            {/* The Authentic Photo Image of the QR Card */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-inner flex flex-col items-center">
              <img
                src={QR_IMAGE_URL}
                alt="InstaPay QR Ph Official Payment Card - Karll Genesis Jacob"
                className="w-full h-auto object-contain select-none cursor-pointer group-hover:scale-[1.01] transition-transform duration-300"
                onClick={() => setIsZoomOpen(true)}
              />

              {/* Hover overlay hint */}
              <div 
                onClick={() => setIsZoomOpen(true)}
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5 text-[#0057E7]" />
                  <span>Click to Zoom QR</span>
                </div>
              </div>
            </div>

            {/* Quick Card Controls */}
            <div className="mt-2.5 pt-2 flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all border border-white/15 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3 text-blue-200" />
                <span>Zoom In</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-blue-50 active:scale-95 text-[#0057E7] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-3 h-3 text-[#0057E7]" />
                <span>Save QR Image</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-sand-muted text-center mt-3 max-w-[280px] leading-relaxed">
            Compatible with <strong className="text-ivory">GCash, Maya, BDO, BPI, UnionBank</strong>, or any mobile bank app supporting QR Ph / InstaPay.
          </p>
        </div>

        {/* Right Column: Beneficiary Account Details, Input & Proof Attachment */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Copy Account Details */}
          <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-sans-body tracking-[0.15em] text-sunset-coral font-semibold">
                Official Settlement Details
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>InstaPay / QR Ph</span>
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans-body">
              {/* Beneficiary Name */}
              <div className="flex items-center justify-between bg-[#070B0E] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-sand-muted block text-[10px]">Beneficiary Name</span>
                  <span className="text-ivory font-medium tracking-wide">{ACCOUNT_NAME}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyName}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-sand-muted hover:text-ivory flex items-center gap-1.5 transition-all font-mono text-[11px] cursor-pointer"
                >
                  {copiedName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedName ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* GCash / Mobile Number */}
              <div className="flex items-center justify-between bg-[#070B0E] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-sand-muted block text-[10px]">GCash / Mobile Number</span>
                  <span className="text-ivory font-mono font-bold tracking-wider text-sm">{GCASH_NUMBER}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 rounded-lg bg-sunset-coral/15 hover:bg-sunset-coral/25 active:scale-95 text-sunset-coral flex items-center gap-1.5 transition-all font-mono text-[11px] font-medium border border-sunset-coral/30 cursor-pointer"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? 'Copied!' : 'Copy Number'}</span>
                </button>
              </div>

              {/* Amount Due to Send */}
              <div className="flex items-center justify-between bg-[#070B0E] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-sand-muted block text-[10px]">
                    Exact Amount to Send ({paymentOption === 'deposit' ? '50% Downpayment' : '100% Full Settlement'})
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-base">
                    ₱{amountDue.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-sand-muted hover:text-ivory flex items-center gap-1.5 transition-all font-mono text-[11px] cursor-pointer"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAmount ? 'Copied' : 'Copy Amount'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Proof of Payment Submission (Scam Prevention Architecture) */}
          <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <label htmlFor="payment-ref-field" className="text-xs uppercase font-sans-body tracking-[0.15em] text-ivory font-semibold flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-sunset-coral" />
                <span>Proof of Payment Submission</span>
              </label>
              <span className="text-[10px] font-mono text-sand-muted">Step 2 of 2</span>
            </div>

            {/* Reference Number Field */}
            <div className="space-y-1.5">
              <label htmlFor="payment-ref-field" className="text-xs text-sand-muted block font-medium">
                GCash / Maya / Bank Reference Number <span className="text-sunset-coral">*</span>
              </label>
              <input
                id="payment-ref-field"
                type="text"
                value={referenceNo}
                onChange={(e) => onReferenceNoChange(e.target.value)}
                placeholder="e.g. 1004 8839 2019 or 2026-991823"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B0E] border border-white/15 text-ivory font-mono text-xs focus:outline-none focus:border-sunset-coral transition-colors"
              />
            </div>

            {/* Receipt Screenshot Upload Box */}
            <div className="space-y-1.5">
              <span className="text-xs text-sand-muted block font-medium">
                Upload Photo / Screenshot of Transaction Slip <span className="text-sunset-coral">*</span>
              </span>

              {receiptProofUrl ? (
                <div className="rounded-xl border border-cyan-500/40 bg-[#070B0E] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={receiptProofUrl}
                      alt="Uploaded Receipt Proof"
                      className="w-14 h-14 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setIsReceiptZoomOpen(true)}
                      title="Click to preview receipt full size"
                    />
                    <div>
                      <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Receipt Attached (Pending Manual Audit)</span>
                      </span>
                      <span className="text-[10px] text-sand-muted block mt-0.5">
                        Ready for Finance Officer verification
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onReceiptProofChange('')}
                      className="text-xs text-sand-muted hover:text-rose-400 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer font-mono"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/15 hover:border-sunset-coral/50 active:scale-[0.99] rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-[#070B0E]/60 hover:bg-[#070B0E] cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-sand-muted" />
                  <span className="text-xs text-ivory font-medium">
                    {isUploading ? 'Uploading and preparing photo...' : 'Click or Drag to Upload Receipt Photo'}
                  </span>
                  <span className="text-[10px] text-sand-muted font-mono">
                    Supports JPG, PNG, WEBP (Official GCash/Bank screenshot)
                  </span>
                </label>
              )}

              {/* QA / Demo Helper: Attach simulated slip */}
              {!receiptProofUrl && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAttachMockSample}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                    title="Quickly generate a demo GCash confirmation receipt for testing"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Attach Sample GCash Receipt (For Testing)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Anti-Scam Security Banner (Strict Compliance with User Instruction) */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[11px] text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Manual Verification & Anti-Fraud Protection</span>
              </div>
              <p className="leading-relaxed text-[11px] text-sand-muted">
                Receipts and reference numbers are <strong className="text-amber-200">manually audited by our Finance Officer</strong> against official bank and merchant statements before issuing final booking clearance. Fabricated or duplicate receipts will automatically void the reservation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen QR Lightbox Modal */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="bg-[#0066FF] p-4 rounded-3xl max-w-sm w-full relative shadow-2xl border border-blue-400/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={QR_IMAGE_URL}
              alt="InstaPay QR Ph Payment Card Zoomed"
              className="w-full h-auto rounded-2xl shadow-xl"
            />

            <div className="mt-3 text-center text-white text-xs space-y-2">
              <p className="font-semibold text-sm">Scan with any Philippine Banking or E-Wallet App</p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-4 py-2 rounded-xl bg-white text-[#0057E7] font-semibold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Proof Fullscreen Zoom Modal */}
      {isReceiptZoomOpen && receiptProofUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsReceiptZoomOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-[#0B1014] border border-white/20 rounded-3xl p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold text-ivory">Attached Receipt Proof</span>
              <button
                type="button"
                onClick={() => setIsReceiptZoomOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-white/10 bg-black flex items-center justify-center p-2">
              <img
                src={receiptProofUrl}
                alt="Receipt Proof Full View"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
