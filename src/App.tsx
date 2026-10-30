import { useState } from 'react'
import './styles/App.css'
import type { SummaryStyle } from "./utils/summary";
import { summarizeText } from "./services/summaryService";
// 履歴
import type { SummaryHistory } from "./types/history";
import { getHistory, saveHistory } from "./services/historyService";

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

      // 新しい履歴を作成
      const newHistory: SummaryHistory = {
        id: crypto.randomUUID(),
        text,
        summary: result,
        summaryStyle,
        createdAt: new Date().toISOString(),
      };

      // 既存の履歴の先頭に追加（最大保存件数はここで指定）
      const updatedHistory = [newHistory, ...history].slice(0, 20);

      // 保存して、画面側の state も更新
      saveHistory(updatedHistory);
      setHistory(updatedHistory);

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1000);

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
  // ページ切り替え
  const [currentView, setCurrentView] = useState<"summary" | "history">("summary");
  // 履歴
  const [history, setHistory] = useState<SummaryHistory[]>(
    () => getHistory()
  );

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
      <div className="menuList">
        <button
          type="button"
          onClick={() => setCurrentView("summary")}
          className={currentView === "summary" ? 'active':''}
        >
          要約
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("history")}
          className={currentView === "history" ? 'active':''}
        >
          履歴
        </button>
      </div>
      {currentView === "summary" ? (
      // 要約
      <section className="space-s">
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
                className={`normal ${summaryStyle === "normal" ? "active" : ""} `}
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
                className={`bullet ${summaryStyle === "bullet" ? "active" : ""} `}
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
                className={`simple ${summaryStyle === "simple" ? "active" : ""} `}
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
                  className={`toast ${copiedId === "summary" ? "active" : ""}`}
                  type="button"
                  onClick={() => handleCopy(summary, "summary")}
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
      ) : (
      // 履歴
      <section className="space-s">
        <div className="historyHeader">
          <h2>履歴</h2>
          <p className="historyHeader_text">最大20件まで保存され、21件目以降は古い順から削除されます。</p>
        </div>
        {history.length === 0 ? (
          <div className="defaultBox">
            <p className="space-s">履歴はまだありません。</p>
          </div>
        ) : (
          <ul className="space-ss historyList">
            {history.map((item) => (
            <li className="historyList_item" key={item.id}>
              <div className="defaultBox">
                <p className="historyList_item_time">
                  {new Date(item.createdAt).toLocaleString("ja-JP")}
                </p>
                <p className="historyList_item_style"><span className={
                  item.summaryStyle === "normal" ? "normal" :
                  item.summaryStyle === "bullet" ? "bullet" :
                  item.summaryStyle === "simple" ? "simple" : ""
                }>
                {
                  item.summaryStyle === "normal" ? "通常要約" :
                  item.summaryStyle === "bullet" ? "箇条書き" :
                  item.summaryStyle === "simple" ? "優しい表現" : ""
                }</span></p>
                <div className="space-s historyList_input">
                  <h3 className="historyList_input_title">元の文章</h3>

                  <p className="historyList_input_text">{item.text}</p>
                </div>
                <div className="space-s historyList_result">
                  <h3 className="historyList_result_title">要約結果</h3>
                  <button
                    className={`historyList_result_copy toast ${copiedId === item.id ? "active" : ""}`}
                    onClick={() => handleCopy(item.summary, item.id)}
                  >
                    結果をコピー
                  </button>
                  <p className="historyList_result_text">{item.summary}</p>
                </div>
              </div>
            </li>
            ))}
          </ul>
        )}
      </section>
      )}
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
