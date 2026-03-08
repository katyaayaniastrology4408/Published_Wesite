"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useOffer } from "@/hooks/useOffer";
import { Flame } from "lucide-react";

interface PriceDisplayProps {
  amount: number | string;
  className?: string;
  showBadge?: boolean;
  showUrgency?: boolean;
}

export function PriceDisplay({ amount, className = "", showBadge = true, showUrgency = true }: PriceDisplayProps) {
  const { theme } = useTheme();
  const { offer, isOfferValid, loading } = useOffer();

  // If loading or offer is not valid OR the amount passed doesn't match the original offer price (851),
  // just show the normal amount without strike-through.
  if (loading || !isOfferValid || !offer || Number(amount) !== offer.original_price) {
    return <span className={`font-black ${className}`}>₹ {amount}</span>;
  }

  // Offer is valid! Show strike-through and badge.
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <span className={`text-sm line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          ₹{offer.original_price}
        </span>
        <span className={`font-black text-red-500 ${className}`}>
          ₹{offer.offer_price}
        </span>
      </div>
      
      {showBadge && (
        <div className="flex items-center gap-1 mt-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border border-red-500/20">
          <Flame className="w-3 h-3" />
          <span>{offer.title || `Special Offer – Only for First ${offer.max_slots} Users`}</span>
        </div>
      )}

      {showUrgency && (
        <span className="text-[10px] text-red-500 font-bold tracking-wider mt-0.5 animate-pulse">
          ⚡ Only {Math.max(0, offer.max_slots - offer.used_slots)} Slots Left
        </span>
      )}
    </div>
  );
}
