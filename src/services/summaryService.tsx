
import type { SummaryStyle } from "../utils/summary";

const API_URL = "https://ai-summary-api.kakiikada.workers.dev/";

export const summarizeText = async (
  text: string,
  summaryStyle: SummaryStyle
): Promise<string> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      summaryStyle,
    }),
  });

  const data: { summary?: string; error?: string } =
    await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "要約に失敗しました");
  }

  if (!data.summary) {
    throw new Error("要約結果を取得できませんでした");
  }

  return data.summary;
};
