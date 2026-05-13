import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="app homeApp">
      <header className="header">
        <h1 className="title">命理推演</h1>
        <p className="subtitle">选择术数门类 · DeepSeek 辅助解读 · 仅供文化参考</p>
      </header>

      <div className="entryGrid">
        <Link to="/bazi" className="entryCard">
          <span className="entryIcon" aria-hidden>
            八
          </span>
          <h2 className="entryTitle">八字算命</h2>
          <p className="entryDesc">四柱五行、喜忌、大运流年等子平八字思路推演。</p>
          <span className="entryCta">进入</span>
        </Link>

        <Link to="/ziwei" className="entryCard entryCardAlt">
          <span className="entryIcon entryIconAlt" aria-hidden>
            紫
          </span>
          <h2 className="entryTitle">紫微斗数</h2>
          <p className="entryDesc">命宫十二宫、星曜组合、大限流年等紫微盘式解读。</p>
          <span className="entryCta">进入</span>
        </Link>

        <Link to="/liuyao" className="entryCard entryCardYi">
          <span className="entryIcon entryIconYi" aria-hidden>
            易
          </span>
          <h2 className="entryTitle">六爻 / 周易</h2>
          <p className="entryDesc">问事占断：可自报卦象，或由模型据时间与报数推演并析卦。</p>
          <span className="entryCta">进入</span>
        </Link>

        <Link to="/xingzuo" className="entryCard entryCardAstro">
          <span className="entryIcon entryIconAstro" aria-hidden>
            星
          </span>
          <h2 className="entryTitle">占星 · 星座</h2>
          <p className="entryDesc">公历生日与可选出生时刻，西方占星与十二星座视角解读。</p>
          <span className="entryCta">进入</span>
        </Link>

        <Link to="/tarot" className="entryCard entryCardTarot">
          <span className="entryIcon entryIconTarot" aria-hidden>
            塔
          </span>
          <h2 className="entryTitle">塔罗牌</h2>
          <p className="entryDesc">自定义问题与牌阵；可自报牌面或由模型模拟抽牌解读。</p>
          <span className="entryCta">进入</span>
        </Link>
      </div>

      <p className="footerNote">请选择一种方式进入；结果由大模型生成，仅供娱乐与文化参考。</p>
    </div>
  );
}
