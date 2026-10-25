"use client";

import React, { useState } from "react";
import { Lock, KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminLoginGateProps {
  currentPassword?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  currentPassword = "palakkad@eco",
  onSuccess,
  onCancel,
}) => {
  const [inputPass, setInputPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPass.trim()) {
      setError("ദയവായി അഡ്മിൻ പാസ്‌വേഡ് നൽകുക.");
      return;
    }

    if (inputPass.trim() === currentPassword.trim()) {
      setError("");
      onSuccess();
    } else {
      setError("തെറ്റായ അഡ്മിൻ പാസ്‌വേഡ്! വീണ്ടും ശ്രമിക്കുക.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-card rounded-3xl border shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white flex items-center justify-center mx-auto shadow-md">
        <Lock className="w-8 h-8 text-emerald-200" />
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-foreground">ഷോപ്പ് അഡ്മിൻ ലോഗിൻ</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
          ഉൽപ്പന്നങ്ങൾ ചേർക്കാനും വില മാറ്റാനും വരുന്ന ഓർഡറുകൾ കാണാനും അഡ്മിൻ പാസ്‌വേഡ് നൽകുക.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            അഡ്മിൻ രഹസ്യ പാസ്‌വേഡ് (Admin Password) *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="പാസ്‌വേഡ് നൽകുക..."
              value={inputPass}
              onChange={(e) => {
                setInputPass(e.target.value);
                setError("");
              }}
              className="h-11 text-sm pr-10 rounded-xl font-mono"
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md"
          >
            <span>അഡ്മിൻ പാനലിലേക്ക് പ്രവേശിക്കുക</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            ഷോപ്പിലേക്ക് മടങ്ങുക
          </Button>
        </div>
      </form>

      {/* Default Password Hint for Owner */}
      <div className="pt-2 border-t text-[11px] text-muted-foreground/80 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>
          നിലവിലെ ഡിഫോൾട്ട് പാസ്‌വേഡ്: <strong className="font-mono text-foreground">palakkad@eco</strong>
        </span>
      </div>
    </div>
  );
};
