"use client";

import React, { useState, useEffect } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യാൻ ബ്രൗസർ മെനുവിൽ നിന്ന് 'Add to Home Screen' അല്ലെങ്കിൽ 'Install App' തിരഞ്ഞെടുക്കുക.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white px-4 py-2 border-b text-xs flex items-center justify-between gap-2 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-emerald-500/20 rounded-lg">
          <Smartphone className="w-4 h-4 text-emerald-300" />
        </div>
        <div>
          <span className="font-semibold">പാലക്കാട് എക്കോ ഷോപ്പ് മൊബൈൽ ആപ്പ്</span>
          <span className="hidden sm:inline text-emerald-200 ml-1.5">
            • വേഗത്തിൽ ഓർഡർ ചെയ്യാൻ നിങ്ങളുടെ ഫോണിൽ ഇൻസ്റ്റാൾ ചെയ്യാം!
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={handleInstallClick}
          className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-lg shadow-sm"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          ഇൻസ്റ്റാൾ ചെയ്യുക
        </Button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-emerald-300 hover:text-white"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
