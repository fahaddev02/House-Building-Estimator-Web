import React from "react";
import { GOOGLE_PLAY_STORE_URL } from "@/lib/config/site";

interface GooglePlayButtonProps {
  url?: string;
  className?: string;
  size?: "default" | "large" | "compact";
  theme?: "dark" | "light";
}

/**
 * Official Google Play Store Badge / CTA Button
 */
export default function GooglePlayButton({
  url = GOOGLE_PLAY_STORE_URL,
  className = "",
  size = "default",
  theme = "dark",
}: GooglePlayButtonProps) {
  const isDark = theme === "dark";

  // Size styling classes
  const sizeClasses = {
    compact: "px-3.5 py-2 rounded-xl text-xs gap-2.5 min-h-[44px]",
    default: "px-5 py-2.5 rounded-2xl text-xs gap-3.5 min-h-[50px]",
    large: "px-6 py-3.5 rounded-2xl text-sm gap-4 min-h-[56px]",
  };

  const iconSizes = {
    compact: "w-5 h-5",
    default: "w-6 h-6 sm:w-7 sm:h-7",
    large: "w-7 h-7 sm:w-8 sm:h-8",
  };

  const subtextSizes = {
    compact: "text-[9px] tracking-wider",
    default: "text-[10px] tracking-wider",
    large: "text-[11px] tracking-wider",
  };

  const mainTextSizes = {
    compact: "text-xs font-bold",
    default: "text-sm sm:text-base font-extrabold",
    large: "text-base sm:text-lg font-extrabold",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get it on Google Play"
      className={`inline-flex items-center justify-center font-sans transition-all duration-200 select-none group border shadow-sm hover:shadow-md active:scale-98 ${
        isDark
          ? "bg-slate-950 hover:bg-black text-white border-slate-800 hover:border-slate-700"
          : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300"
      } ${sizeClasses[size]} ${className}`}
    >
      {/* Official Google Play Triangle Icon */}
      <svg
        className={`shrink-0 transition-transform group-hover:scale-105 ${iconSizes[size]}`}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M325.3 234.3L104.6 13l280.8 161.2-60.1 59.9.0.2z"
          fill="#00E676"
        />
        <path
          d="M47 0C34 0 23.3 5.3 15.6 13.9L283.4 281.7l41.9-41.9L47 0z"
          fill="#00B0FF"
        />
        <path
          d="M47 512c-13 0-23.7-5.3-31.4-13.9L283.4 230.3l41.9 41.9L47 512z"
          fill="#FF3D00"
        />
        <path
          d="M496.4 227.4L385.4 164.2l-60.1 60.1 60.1 60.1 111-63.2c9.5-5.4 15.6-15.6 15.6-26.9s-6.1-21.5-15.6-26.9z"
          fill="#FFC107"
        />
        <path
          d="M325.3 277.7L104.6 499l280.8-161.2-60.1-60.1z"
          fill="#FF3D00"
        />
        <path
          d="M15.6 13.9C5.8 24.8 0 39.7 0 56.4v399.2c0 16.7 5.8 31.6 15.6 42.5L263 256 15.6 13.9z"
          fill="#00B0FF"
        />
      </svg>

      {/* Button Text */}
      <div className="flex flex-col text-left leading-tight">
        <span
          className={`uppercase font-semibold opacity-80 ${
            isDark ? "text-slate-300" : "text-slate-600"
          } ${subtextSizes[size]}`}
        >
          GET IT ON
        </span>
        <span
          className={`tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          } ${mainTextSizes[size]}`}
        >
          Google Play
        </span>
      </div>
    </a>
  );
}

