"use client";

import { Navigation } from "lucide-react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import type { GeofenceConfigProps } from "../types";

export function GeofenceConfig({ 
  triggerRadius,
  onRadiusChange
}: GeofenceConfigProps) {
  const { t } = usePreferences();

  const maxRadius = 1000; 
  const fillPercentage = (triggerRadius / maxRadius) * 100;

  return (
    <div className="card bg-surface border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <Navigation className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-lg text-foreground">{t("Geofence Configuration")}</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted">{t("Global Trigger Radius")}</label>
          <span className="text-sm font-bold text-accent">{triggerRadius}m</span>
        </div>
        
        {/* THANH TRƯỢT KÉO THẢ */}
        <div className="relative flex items-center h-2 w-full mt-1">
          <input 
            type="range" 
            min="0" 
            max={maxRadius} 
            value={triggerRadius}
            onChange={onRadiusChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer border border-border/50 accent-accent"
            style={{ 
              backgroundColor: "var(--background)",
              backgroundImage: "linear-gradient(var(--accent), var(--accent))",
              backgroundSize: `${fillPercentage}% 100%`,
              backgroundRepeat: "no-repeat"
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">{t("Min Trigger Distance")}</label>
          <input type="text" defaultValue="50m" className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">{t("Max Trigger Distance")}</label>
          <input type="text" defaultValue="500m" className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent" />
        </div>
      </div>
    </div>
  );
}