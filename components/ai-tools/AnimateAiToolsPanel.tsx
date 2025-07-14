import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Copy } from "lucide-react";
import TypewriterText from "./TypewriterText";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { storeAIResult } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Example quick prompts
const quickPrompts = [
  "Analyze AIMS",
  "Analyze RS Finance",
  "Analyze FP Markets",
  "Analyze IC Markets",
  "Best broker promotions",
  "Best Trading Environment",
  "Best User Experience",
  "Most Regulated Brokers",
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

export default function AnimateAiToolsPanel({ setOpen }: { setOpen: (open: boolean) => void }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  type Message = { sender: 'ai' | 'user'; text: string, date: string };
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I am your AI broker analyst powered by advanced AI \nI can help you with: \n  - Broker comparisons and reviews\n  - Regulatory information\n  - Trading conditions analysis\n  - Platform recommendations\n  - Market insights\nWhat would you like to know about forex brokers?", date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) }
  ]);

  useEffect(() => {
    // Use a single timer and message queue to avoid multiple setMessages
    const demoMessages: { delay: number; msg: Message; }[] = [
      { delay: 3000, msg: { sender: 'user', text: "Analyze RS Finance", date: '' } },
      { delay: 4000, msg: { sender: 'ai', text: "Analyzing...", date: '' } },
      { delay: 8000, msg: { sender: 'ai', text: ai_text, date: '' } },
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
      { sender: 'ai', text: 'Analysing...', date: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) }
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
          const idx = prev.findIndex(m => m.text === 'Analysing...' && m.sender === 'ai');
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { sender: 'ai', text: 'AI Analyse failed: ' + res.statusText, date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) };
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
          const idx = prev.findIndex(m => m.text === 'Analysing...' && m.sender === 'ai');
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
        const idx = prev.findIndex(m => m.text === 'Analysing...' && m.sender === 'ai');
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { sender: 'ai', text: 'AI Analyse failed: ' + (err?.message || err), date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) };
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
          <span className="font-bold text-lg">AI Broker Analyzer</span>
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
          {quickPrompts.map((prompt) => (
            <Button disabled={loading} key={prompt} size="sm" variant="outline" className=" rounded-full px-4 py-1 text-xs bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-x-hidden text-ellipsis whitespace-nowrap truncate max-w-[160px]" onClick={() => !user || !user.email_confirmed_at ? setOpen(true) : router.push(`/ai-tools/trading-assistant?prompt=${encodeURIComponent(prompt)}`)}>
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {prompt}
              </span>
            </Button>
          ))}
        </div>
        {/* Input Field */}
        <div className="flex items-center gap-2 rounded-xl py-2 mt-2">
          <input
            type="text"
            className="flex-1 bg-transparent border border-gray-100 rounded-xl outline-none px-2 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Analyse any broker's regulations, promotions, ratings, spreads, or compare brokers..."
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
