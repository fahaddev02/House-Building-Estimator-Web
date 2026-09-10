/**
 * Site & Application Configuration
 */

// Google Play Store URL - Reuses the verified app listing URL or fallback
export const GOOGLE_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.example.paintcalculatorestimator";

// Backward-compatible alias
export const PLAY_STORE_URL = GOOGLE_PLAY_STORE_URL;

export const SITE_NAME = "Paint Calculator & Estimator";
export const SUPPORT_EMAIL = "support.paintcalculatorestimat@gmail.com";

