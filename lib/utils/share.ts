export interface ShareEstimatePayload {
  title: string;
  projectName?: string;
  area?: string;
  paintRequired?: string;
  labor?: string;
  materials?: string;
  total?: string;
  customSummary?: string;
}

export async function shareEstimate(
  payload: ShareEstimatePayload
): Promise<{ success: boolean; method: "native" | "clipboard" | "error"; message: string }> {
  // Build clean text summary
  let text = `${payload.title}\n`;
  if (payload.projectName) text += `Project: ${payload.projectName}\n`;
  if (payload.area) text += `Area: ${payload.area}\n`;
  if (payload.paintRequired) text += `Paint Required: ${payload.paintRequired}\n`;
  if (payload.labor) text += `Labor: ${payload.labor}\n`;
  if (payload.materials) text += `Materials: ${payload.materials}\n`;
  if (payload.total) text += `Total: ${payload.total}\n`;
  if (payload.customSummary) text += `\n${payload.customSummary}\n`;
  text += `\nCalculated using Paint Calculator & Estimator`;

  // Try Web Share API
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: payload.title,
        text: text,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
      return { success: true, method: "native", message: "Shared successfully!" };
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { success: false, method: "native", message: "Share cancelled." };
      }
      // Continue to clipboard fallback if native share failed
    }
  }

  // Fallback to Clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        method: "clipboard",
        message: "Estimate summary copied to clipboard!",
      };
    } catch (clipErr) {
      console.error("Clipboard copy failed", clipErr);
    }
  }

  // Fallback execCommand for older browsers
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) {
      return {
        success: true,
        method: "clipboard",
        message: "Estimate summary copied to clipboard!",
      };
    }
  } catch (e) {
    console.error("Fallback copy failed", e);
  }

  return {
    success: false,
    method: "error",
    message: "Unable to share or copy to clipboard.",
  };
}
