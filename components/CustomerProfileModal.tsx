"use client";

import React, { useState } from "react";
import { User, Phone, MapPin, CheckCircle, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerProfile } from "@/types";
import { PALAKKAD_DELIVERY_ZONES } from "@/lib/sample-data";

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  onSave: (updated: CustomerProfile) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<CustomerProfile>({ ...profile });
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleZoneChange = (zoneId: string) => {
    const selectedZone = PALAKKAD_DELIVERY_ZONES.find((z) => z.id === zoneId);
    if (selectedZone) {
      setFormData({
        ...formData,
        zone: selectedZone.id,
        pincode: selectedZone.pincode,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("ദയവായി നിങ്ങളുടെ പേര് നൽകുക.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("ദയവായി കൃത്യമായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.");
      return;
    }
    if (!formData.address.trim()) {
      setError("ഡെലിവറി ചെയ്യേണ്ട വിലാസം നൽകുക.");
      return;
    }

    setError("");
    onSave({
      ...formData,
      isRegistered: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">ഉപഭോക്തൃ വിവരങ്ങൾ (Customer Details)</h2>
              <p className="text-xs text-emerald-100">പാലക്കാട് ഡെലിവറിക്ക് വേണ്ടിയുള്ള വിലാസവും ഫോൺ നമ്പറും</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-sm max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="font-medium text-xs flex items-center gap-1.5 text-foreground">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              പേര് (Full Name) *
            </label>
            <Input
              type="text"
              placeholder="ഉദാ: രാഹുൽ കൃഷ്ണൻ"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="font-medium text-xs flex items-center gap-1.5 text-foreground">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              മൊബൈൽ നമ്പർ (Phone / WhatsApp) *
            </label>
            <Input
              type="tel"
              placeholder="10 അക്ക മൊബൈൽ നമ്പർ (ഉദാ: 9847012345)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-10"
              required
            />
            <span className="text-[11px] text-muted-foreground">
              ഓർഡർ അപ്‌ഡേറ്റുകളും ഡെലിവറി വിവരങ്ങളും ഈ നമ്പറിലേക്ക് അറിയിക്കും.
            </span>
          </div>

          {/* Palakkad Area / Delivery Zone */}
          <div className="space-y-1.5">
            <label className="font-medium text-xs flex items-center gap-1.5 text-foreground">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              പാലക്കാട്ടെ നിങ്ങളുടെ പ്രദേശം (Delivery Zone) *
            </label>
            <select
              value={formData.zone}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {PALAKKAD_DELIVERY_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.nameMl} - പിൻകോഡ്: {zone.pincode}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="font-medium text-xs flex items-center gap-1.5 text-foreground">
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              വീട്ടുപേര് / ഫ്ലാറ്റ് നമ്പർ / റോഡ് (Address) *
            </label>
            <textarea
              rows={2}
              placeholder="വീട്ടുപേര്, ഫ്ലാറ്റ് അല്ലെങ്കിൽ റസിഡൻഷ്യൽ ഏരിയ"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          {/* Landmark */}
          <div className="space-y-1.5">
            <label className="font-medium text-xs flex items-center gap-1.5 text-foreground">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              അടുത്തുള്ള പ്രധാന സ്ഥലം (Landmark)
            </label>
            <Input
              type="text"
              placeholder="ഉദാ: കൽപ്പാത്തി ക്ഷേത്രത്തിനടുത്ത് / ഒലവക്കോട് റെയിൽവേ സ്റ്റേഷൻ റോഡ്"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="h-10">
              റദ്ദാക്കുക
            </Button>
            <Button type="submit" className="h-10 bg-emerald-700 hover:bg-emerald-800 text-white font-medium">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              വിവരങ്ങൾ സേവ് ചെയ്യുക
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
