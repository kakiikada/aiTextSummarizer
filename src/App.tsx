import { useState } from 'react'
import './styles/App.css'
import type { SummaryStyle } from "./utils/summary";
import { summarizeText } from "./services/summaryService";

function App() {
  // 入力した文字
  const [text, setText] = useState("");
  // スタイル制御
  const [summaryStyle, setSummaryStyle] =
  useState<SummaryStyle>("normal");
  // 結果を保存
  const [summary, setSummary] = useState("");

const handleSummarize = async () => {
  if (text.trim().length === 0) return;

  setIsLoading(true);
  setSummary("");
  setErrorMessage("");

  try {
    // 外部api連携
    const result = await summarizeText(text, summaryStyle);
    setSummary(result);
  } catch (error) {
    console.error("要約に失敗しました", error);
    setErrorMessage("要約に失敗しました。もう一度お試しください。");
  } finally {
    setIsLoading(false);
  }
};
  // 要約中
  const [isLoading, setIsLoading] = useState(false);
  // コピー機能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch (error) {
      console.error("コピーに失敗しました", error);
    }
  };
  // 入力クリア
  const handleClear = () => {
    setText("");
    setSummary("");
    setSummaryStyle("normal");
  };
  // エラー表示
  const [errorMessage, setErrorMessage] = useState("");
  
  return (
    <>
    <header className="header">
      <div className="header_content">
        <div className="header_content_logo">
          <h1 className="header_content_logo_title">AI Summary</h1>
          <p className="header_content_logo_text">長い文章をすっきり読みやすく、AIが要点をまとめます。</p>
        </div>
      </div>
    </header>
    <main className="contents">
      <section>
        <div className="defaultBox">
          <div className="inputBox">
            <div className="inputBox_header">
              <h2>要約したい文章</h2>
              <button
                type="button"
                onClick={handleClear}
                disabled={text.length === 0 && summary.length === 0}
              >
                クリア
              </button>
            </div>
            <p className={`space-s inputBox_count ${text.length >= 1000 ? "is-limit" : ""}`}>{text.length}/ 1000文字</p>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSummary("");
                setErrorMessage("");
              }}
              maxLength={1000}
              placeholder="ここに文章を入力してください"
            />
            <p className="space-ss inputBox_subText">※入力は1,000文字以内。個人情報や機密情報は入力しないでください。</p>
            <h3 className="space-l">要約スタイル</h3>
            <ul className="inputBox_type">
              <li>
                <button
                type="button"
                className={summaryStyle === "normal" ? "active" : ""}
                onClick={() => {
                  setSummaryStyle("normal");
                  setSummary("");
                  setErrorMessage("");
                }}
                >
                通常要約
                </button>
              </li>

              <li>
                <button
                type="button"
                className={summaryStyle === "bullet" ? "active" : ""}
                onClick={() => {
                  setSummaryStyle("bullet");
                  setSummary("");
                  setErrorMessage("");
                }}
                >
                箇条書き
                </button>
              </li>

              <li>
                <button
                type="button"
                className={summaryStyle === "simple" ? "active" : ""}
                onClick={() => {
                  setSummaryStyle("simple");
                  setSummary("");
                  setErrorMessage("");
                }}
                >
                やさしい表現
                </button>
              </li>
            </ul>
            <button
              className="space-m inputBox_btn" 
              disabled={text.trim().length === 0 || isLoading}
              onClick={handleSummarize}
            >
              {isLoading ? "要約中…" : "文章を要約する"}
            </button>
          </div>

{errorMessage && (
  <p className="error-message" role="alert">
    {errorMessage}
  </p>
)}

        </div>
        {summary && (
        <div className="defaultBox space-m">
          <div className="resultBox">
            <div>
              <div className="resultBox_header">
                <h3>要約結果</h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!summary}
                >
                  結果をコピー
                </button>
              </div>
              <div className="space-ss resultBox_result"><p>{summary}</p></div>
            </div>
          </div>
        </div>
        )}
      </section>
      <div className="space-l note">
        <p>本アプリはポートフォリオおよび機能検証を目的としたデモサービスです。</p>
        <ul className="space-m note">
          <li>入力できる文章は1,000文字以内です。</li>
          <li>無料のAI APIを利用しているため、利用回数や利用状況によって一時的に利用できない場合があります。</li>
          <li>入力した文章は外部のAIサービスに送信されます。そのため、送信データがサービス改善に利用される場合があります。</li>
          <li>個人情報、機密情報、社外秘情報などは入力しないでください。</li>
          <li>実務や業務上の重要な判断には使用しないでください。</li>
          <li>AIが生成した文章には誤りが含まれる場合があります。内容を確認してからご利用ください。</li>
        </ul>
      </div>
    </main>
    </>
  )
}

export default App
