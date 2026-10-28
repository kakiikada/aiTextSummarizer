import { useState } from 'react'
import './styles/App.css'

function App() {
  const [text, setText] = useState("");

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
              <p className={`inputBox_header_count ${text.length >= 1000 ? "is-limit" : ""}`}>{text.length}/ 1000文字</p>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              placeholder="ここに文章を入力してください"
            />
            <p className="space-ss inputBox_subText">※入力は1,000文字以内。個人情報や機密情報は入力しないでください。</p>
            <h3 className="space-l">要約スタイル</h3>
            <ul className="inputBox_type">
              <li><button className="active">通常文章</button></li>
              <li><button>箇条書き</button></li>
            </ul>
            <button className="space-m inputBox_btn" disabled={text.trim().length === 0}>文章を要約する</button>
            <div>
              <h3 className="space-l">要約結果</h3>
              <div className="space-m inputBox_result"><p>結果標示</p></div>
            </div>
          </div>
        </div>
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
