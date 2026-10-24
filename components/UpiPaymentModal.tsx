"use client";

import React, { useState } from "react";
import { QrCode, CheckCircle, Copy, Check, ArrowRight, ExternalLink, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  shopUpiId: string;
  shopName: string;
  onConfirmPayment: (transactionId: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  shopUpiId,
  shopName,
  onConfirmPayment,
}) => {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  if (!isOpen) return null;

  // Standard UPI deep link URL
  const upiUrl = `upi://pay?pa=${encodeURIComponent(shopUpiId)}&pn=${encodeURIComponent(
    shopName
  )}&am=${amount}&cu=INR&tn=PalakkadEcoShop`;

  // QR Code image URL via secure QR server
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    upiUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shopUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    onConfirmPayment(transactionId.trim() || `UPI-PAID-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <QrCode className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm">UPI / GPay പേയ്‌മെന്റ്</h3>
              <p className="text-[11px] text-emerald-200">Palakkad Eco Shop QR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-5 flex flex-col items-center text-center space-y-4">
          <div className="bg-white p-3 rounded-2xl shadow-inner border border-emerald-100">
            <img
              src={qrCodeImageUrl}
              alt="UPI QR Code"
              className="w-44 h-44 object-contain mx-auto"
            />
          </div>

          <div>
            <span className="text-xs text-muted-foreground">അടയ്‌ക്കേണ്ട തുക (Total Amount):</span>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
              ₹{amount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ഏതെങ്കിലും UPI ആപ്പ് (GPay, PhonePe, Paytm) വഴി ഈ QR സ്കാൻ ചെയ്യാം.
            </p>
          </div>

          {/* 1-Click Pay for Mobile Devices */}
          <a
            href={upiUrl}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
          >
            <span>GPay / PhonePe ആപ്പിൽ നേരിട്ട് തുറക്കുക</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Copy UPI ID */}
          <div className="w-full flex items-center justify-between p-2 rounded-xl bg-muted/50 border text-xs">
            <div className="text-left overflow-hidden">
              <span className="text-[10px] text-muted-foreground block">ഷോപ്പ് UPI ID:</span>
              <span className="font-mono font-bold text-foreground truncate block">{shopUpiId}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-[11px] shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 mr-1" />
                  കോപ്പി ചെയ്തു
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  കോപ്പി ചെയ്യാം
                </>
              )}
            </Button>
          </div>

          {/* Transaction Ref Input */}
          <div className="w-full text-left space-y-1">
            <label className="text-[11px] text-muted-foreground font-medium">
              UPI റഫറൻസ് / UTR നമ്പർ (ഓപ്ഷണൽ):
            </label>
            <Input
              type="text"
              placeholder="ഉദാ: 429184910284"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Confirm Payment Button */}
          <Button
            onClick={handleConfirm}
            className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            പേയ്‌മെന്റ് പൂർത്തിയായി, ഓർഡർ ചെയ്യുക
          </Button>
        </div>
      </div>
    </div>
  );
};
