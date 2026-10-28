export type SummaryStyle = "normal" | "bullet" | "simple";

export const createMockSummary = async (
  text: string,
  summaryStyle: SummaryStyle
): Promise<string> => {
  const styleLabel =
    summaryStyle === "normal"
      ? "通常要約"
      : summaryStyle === "bullet"
        ? "箇条書き"
        : "やさしい表現";

  return `【${styleLabel}】

これは仮の要約結果です。
入力された文章：${text}`;
};