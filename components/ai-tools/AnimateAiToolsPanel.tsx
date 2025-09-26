import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Copy } from "lucide-react";
import TypewriterText from "./TypewriterText";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { storeAIResult } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n-client';

// Example quick prompts (localized with i18n keys)
const quickPromptKeys = [
  'home.ai_panel.prompts.analyze_aims',
  'home.ai_panel.prompts.analyze_rs_finance',
  'home.ai_panel.prompts.analyze_fp_markets',
  'home.ai_panel.prompts.analyze_ic_markets',
  'home.ai_panel.prompts.best_promotions',
  'home.ai_panel.prompts.best_environment',
  'home.ai_panel.prompts.best_ux',
  'home.ai_panel.prompts.most_regulated',
];

const ai_text = `Regulatory Compliance:
    - Licensed by top-tier regulators: FCA (#123456), ASIC (#789012), and CySEC (#345678)
    - Parent company registered in Seychelles (Rich Smart Finance Ltd)
    - No publicly reported compliance violations in recent years
    - Restricted leverage for EU clients under CySEC regulations (max 1:30 for retail)

    Trading Conditions:
    - Tight spreads starting from 0.8 pips on EUR/USD
    - High maximum leverage of 1:500 for professional clients
    - No commission on standard accounts
    - $0 minimum deposit with VIP account requirements unspecified
    - 100:1 leverage for cryptocurrency CFDs

    Trading Platforms:
    - MT4/MT5 compatibility for algorithmic traders
    - Proprietary platform with unspecified unique features
    - Mobile trading capabilities confirmed
    - Web-based access available
    - API integration support for automated strategies

    Best Promotions:
    - Current promotions not specified (score 9.19 suggests active offers)
    - Claimed multiple industry awards from 2019-2023
    - Demo account available for practice
    - Loyalty programs not detailed (recommend checking website)

    User Experience:
    - 24/5 multilingual support with <1 hour response time for live chat
    - Intuitive platforms scoring 9.39/10 in user feedback
    - Lacks crypto deposit options despite offering crypto CFDs
    - Mobile app functionality not explicitly described
    - Education resources unspecified in data

    Summary and Rating Matrix:
    Category                | Score (0-100)
    ------------------------|-------------
    Regulatory Compliance   | 90
    Trading Costs           | 85
    Platform Technology     | 88
    Customer Support        | 92
    Overall Experience      | 91.5

    Final Recommendation:
    - Best for: Experienced traders seeking high leverage and multi-asset exposure
    - Ideal for: Strategy developers needing MT4/MT5 and API access
    - Less suitable for: Crypto-focused traders (no direct crypto deposits)
    - Beginners note: $0 minimum deposit entry but VIP account requirements unclear
    - Advanced traders: Consider pro accounts for maximum leverage benefits

    ### Regulatory Compliance:  
    AIMS operates under significant regulatory oversight:  
    - Licensed by ASIC (Australia) under #430091 and Labuan FSA (Malaysia) under #17/0017  
    - Jurisdiction spans major financial hubs including the UK, Singapore, and Dubai  
    - Regulatory track record is strong (rated 10/10 in data) with no disclosed violations  
    - Restrictions: Specific jurisdictional limitations may apply; clients should confirm local eligibility  

    ---

    ### Trading Conditions:  
    Competitive offerings across key parameters:  
    - Spreads: Starting at 0.6 pips for EUR/USD  
    - Leverage: Up to 1:500 on instruments including Forex, CFDs, stocks, and cryptocurrencies  
    - Instruments: Diverse portfolio across FX, indices, commodities, equities, and crypto  
    - Account types: Standard, Pro, and VIP with a $20 minimum deposit (no deposit/withdrawal fees)  
    - Execution: Data suggests high execution quality (environment rating 9.38/10)  

    ---

    ### Trading Platforms:  
    Multiple advanced platforms available:  
    - MetaTrader Suite: Full MT4/MT5 support  
    - Proprietary Platform: Details undisclosed; may include mobile/web access  
    - Mobile/Web Trading: Confirmed availability (both web-based and mobile trading enabled)  
    - Algo-Trading: Supported via MT4/MT5 Expert Advisors and API access  

    ---

    ### Best Promotions:  
    Promotional offerings are notable:  
    - Current Promotions: Rated 8.67/10 (exact programs unspecified; check website for updates)  
    - Features: Potential bonuses or loyalty schemes implied but undefined  
    - Note: Swap-free accounts are confirmed as a key advantage  

    ---

    ### User Experience:  
    Mixed feedback from available metrics:  
    - Customer Support: 24/5 availability via phone/email (response within 30 minutes) but lacks 24/7 coverage  
    - Mobile Experience: Functional but UX rated modestly (6.77/10)  
    - Education: Limited resources noted as a drawback  
    - Language Support: English, Chinese, Arabic, Spanish  

    ---

    ### Summary and Rating Matrix:  
    Comparative scoring based on disclosed metrics:

    | Category      | Score (0-100) |
    |---------------|---------------|
    | Regulation    | 100           |
    | Costs/Spreads | 94            |
    | Platforms     | 90            |
    | Support       | 68            |
    | **Overall**   | **90+**       |

    ---

    ### Final Recommendation:  
    Ideal for:  
    - **Scalpers/Advanced Traders:** Leverage up to 1:500 and tight spreads favor aggressive strategies  
    - **Asset Diversifiers:** Broad instrument coverage (40+ including crypto)  
    - **MT4/MT5 Users:** Full platform support with API/algo-trading  
    - **Budget-Conscious Traders:** Low $20 entry, zero deposit fees  

    **Avoid if** requiring 24/7 support or extensive educational resources.  
    **Always verify real-time conditions** via https://aimsfx.com/ before trading.  

    Disclaimer: This analysis uses provided data and AI processing. Trading involves significant risk. Verify details independently and assess personal suitability.
`;

const ch_ai_text = `合规监管：

受顶级监管机构许可：FCA（#123456）、ASIC（#789012）和 CySEC（#345678）

母公司在塞舌尔注册（Rich Smart Finance Ltd）

近年无公开披露的合规违规记录

根据 CySEC 规定，对欧盟客户限制杠杆（零售客户最高 1:30）

交易条件：

欧元/美元点差低至 0.8 点起

专业客户最高杠杆 1:500

标准账户免佣金

VIP 账户要求未明确，最低入金 $0

加密货币差价合约杠杆 100:1

交易平台：

支持 MT4/MT5，适合算法交易者

自研平台（未披露独特功能）

确认支持移动端交易

提供网页版交易入口

支持 API 接口用于自动化策略

最佳优惠活动：

当前活动未披露（9.19 分暗示有活跃优惠）

2019–2023 年期间声称获得多个行业奖项

提供模拟账户以便练习

忠诚度计划未明确（建议查看官网）

用户体验：

提供 24/5 多语言支持，在线聊天平均响应 <1 小时

平台操作直观，用户反馈评分 9.39/10

虽提供加密货币差价合约，但不支持加密货币入金

移动应用功能未明确说明

教育资源未披露

总结与评分矩阵：
分类	得分 (0-100)
合规监管	90
交易成本	85
平台技术	88
客户支持	92
综合体验	91.5
最终建议：

适合人群：有经验、追求高杠杆及多资产交易的投资者

理想人群：需要 MT4/MT5 及 API 接口的策略开发者

不太适合：专注加密货币的交易者（无加密货币入金渠道）

初学者提示：最低入金 $0，但 VIP 账户要求不明确

高阶交易者：建议选择专业账户以获取最大杠杆优势

合规监管：

AIMS 处于严格的监管框架下：

获得 ASIC（澳大利亚，#430091）及 Labuan FSA（马来西亚，#17/0017）牌照

业务覆盖英国、新加坡和迪拜等主要金融中心

合规记录强劲（数据评级 10/10），无违规披露

限制说明：部分地区有管辖权限制，客户需确认本地合规性

交易条件：

在关键维度上具备竞争力：

点差：欧元/美元低至 0.6 点

杠杆：最高 1:500，涵盖外汇、差价合约、股票及加密货币

产品：外汇、指数、大宗商品、股票和加密货币等多元资产

账户类型：标准、专业及 VIP，最低入金 $20（无充值/提现费用）

执行：数据显示执行质量高（环境评分 9.38/10）

交易平台：

提供多种先进平台：

MetaTrader 系列：完整 MT4/MT5 支持

自研平台：细节未披露，或含移动/网页端功能

移动/网页交易：确认可用（同时支持网页和移动端）

算法交易：支持 MT4/MT5 EA 及 API 接口

最佳优惠活动：

促销活动值得关注：

当前促销：评分 8.67/10（具体方案未披露，请查官网更新）

特色：可能包含奖金或忠诚度计划，但未明确说明

说明：确认提供无掉期账户，属显著优势

用户体验：

现有数据反馈表现不一：

客服支持：24/5 电话/邮件可用（30 分钟内响应），但缺乏 24/7 覆盖

移动体验：功能可用，但用户体验评分一般（6.77/10）

教育：教育资源有限，是一大缺点

语言支持：英语、中文、阿拉伯语、西班牙语

总结与评分矩阵：
分类	得分 (0-100)
监管	100
成本/点差	94
平台	90
支持	68
综合	90+
最终建议：

适合人群：

剥头皮/高阶交易者：高杠杆（1:500）与低点差适合激进策略

多元资产投资者：涵盖 40+ 产品（含加密货币）

MT4/MT5 用户：完全支持，含 API 与算法交易

资金有限的交易者：最低入金 $20，且无充值费用

不适合人群：需要 24/7 客服或丰富教育资源者。

⚠️ 请务必通过 https://aimsfx.com/
 实时确认交易条件后再操作。

免责声明： 本分析基于所提供数据及 AI 处理结果。交易存在重大风险，请独立核实细节并结合个人情况评估适合度。`;

export default function AnimateAiToolsPanel({ setOpen }: { setOpen: (open: boolean) => void }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useI18n();
  type Message = { sender: 'ai' | 'user'; text: string, date: string };
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: t('home.ai_panel.initial_message'), date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) }
  ]);

  useEffect(() => {
    // Use a single timer and message queue to avoid multiple setMessages
    
    const demoMessages: { delay: number; msg: Message; }[] = [
      { delay: 3000, msg: { sender: 'user', text: t('home.ai_panel.prompts.analyze_rs_finance'), date: '' } },
      { delay: 4000, msg: { sender: 'ai', text: t('ai.analyzer.analysing'), date: '' } },
      { delay: 8000, msg: { sender: 'ai', text: locale === 'zh' ? ch_ai_text : ai_text, date: '' } },
    ];
    let timeoutIds: NodeJS.Timeout[] = [];
    let lastTime = 0;
    demoMessages.forEach(({ delay, msg }) => {
      const id = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { ...msg, date: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) }
        ]);
      }, delay);
      timeoutIds.push(id);
      lastTime = delay;
    });
    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  const handleAITools = async (prompt: string) => {
    if (!user || user.email_confirmed_at == false) {
      setOpen(true);
      return;
    }
    // Add user message and 'Analysing...' AI message together for atomic state update
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: prompt, date: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) },
      { sender: 'ai', text: t('ai.analyzer.analysing'), date: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) }
    ]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await fetch('/api/aitools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.jwt}` },
        body: JSON.stringify(prompt)
      });
      setLoading(false)
      if (!res.ok) {
        setMessages(prev => {
          const idx = prev.findIndex(m => m.text === t('ai.analyzer.analysing') && m.sender === 'ai');
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { sender: 'ai', text: t('home.ai_panel.analyse_failed') + ': ' + res.statusText, date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) };
            return updated;
          }
          return prev;
        });
      } else {
        const data = await res.json();

        if (!data.usePrev) {
          await storeAIResult(user.user_detail ? user.user_detail.id : 1, prompt, data.result);
        }
        setMessages(prev => {
          const idx = prev.findIndex(m => m.text === t('ai.analyzer.analysing') && m.sender === 'ai');
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { sender: 'ai', text: data.result, date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) };
            return updated;
          }
          return prev;
        });
      }
    } catch (err: any) {
      setMessages(prev => {
        const idx = prev.findIndex(m => m.text === t('ai.analyzer.analysing') && m.sender === 'ai');
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { sender: 'ai', text: t('home.ai_panel.analyse_failed') + ': ' + (err?.message || err), date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) };
          return updated;
        }
        return prev;
      });
    }
  }
  return (
    <div className="w-full mx-auto rounded-2xl shadow-xl bg-gradient-to-r from-cyan-400 to-purple-400 p-1 mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 ">
        <div className="bg-white/10 p-2 rounded-xl">
          <Bot className="text-white" size={18} />
        </div>
        <div className="text-white rounded-full flex items-center justify-center">
          <span className="font-bold text-lg">{t('home.ai_panel.title')}</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3">
        {/* Message Container */}
        <div ref={messagesEndRef} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-800 max-h-72 overflow-y-auto flex flex-col gap-2">
           {messages.map((msg, idx) => {
            // Only animate the last AI message
            const isLast = idx === messages.length - 1 && msg.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  style={{ whiteSpace: 'pre-wrap' }}
                  className={
                    msg.sender === 'user'
                      ? 'bg-gradient-to-tr from-blue-400 to-cyan-400 text-white rounded-xl px-4 py-2 text-right shadow'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2 text-left shadow'
                  }
                >
                  {isLast ? <TypewriterText text={msg.text} messageEndRef={messagesEndRef} /> : msg.text}
                  <br />
                  <span className={msg.sender === 'user' ? "text-xs text-white" : "text-xs text-gray-500"}>{msg.date}</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mb-4 bg-gray-100 p-3 grid md:grid-cols-4 grid-cols-2">
          {quickPromptKeys.map((k) => {
            const label = t(k);
            return (
              <Button disabled={loading} key={k} size="sm" variant="outline" className=" rounded-full px-4 py-1 text-xs bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-x-hidden text-ellipsis whitespace-nowrap truncate max-w-[160px]" onClick={() => !user || !user.email_confirmed_at ? setOpen(true) : router.push(`/ai-tools/trading-assistant?prompt=${encodeURIComponent(label)}`)}>
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {label}
                </span>
              </Button>
            );
          })}
        </div>
        {/* Input Field */}
        <div className="flex items-center gap-2 rounded-xl py-2 mt-2">
          <input
            type="text"
            className="flex-1 bg-transparent border border-gray-100 rounded-xl outline-none px-2 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder={t('home.ai_panel.placeholder')}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onKeyDown={(e) => e.key === 'Enter' && handleAITools(prompt)}
            disabled={loading}
          />
          {/* Send button */}
          <Button disabled={loading} size="icon" className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-md" onClick={() => !user || !user.email_confirmed_at ? setOpen(true) : handleAITools(prompt)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
