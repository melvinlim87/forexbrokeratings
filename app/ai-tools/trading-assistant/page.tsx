"use client";
import React, {useState, useEffect, useRef} from "react";
import { useSearchParams } from 'next/navigation';
import { AiToolsPanel } from "@/components/ai-tools/AiToolsPanel";
import { useLoginModal } from '@/components/broker/LoginModalContext';
import LoginModal from '@/components/ui/LoginModal';
import { LoginModalProvider } from '@/components/broker/LoginModalContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchAIResultByUserId } from '@/lib/supabase';

export default function TradingAssistantPage() {
  return (
    <LoginModalProvider>
      <TradingAssistantPageContent />
    </LoginModalProvider>
  );
}


function TradingAssistantPageContent() {
  const { open, setOpen } = useLoginModal();
  const aiToolsPanelRef = React.useRef<any>(null);
  const [pre_prompt, setPrePrompt] = useState('');
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const prompt = searchParams?.get('prompt');
    if (prompt) {
      setPrePrompt(prompt);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadHistory() {
      if (!user || !user.id) return;
      setLoading(true);
      setError(null);
      try {
        // fetchAIResultByUserId returns a single result, but we want all
        // So we fetch manually for all user's ai_results
        const data = await fetchAIResultByUserId(user.user_detail?.id);
        // if (error) throw new Error(error.message);
        setHistory(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load history');
      } finally {   
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  return (
    <div className="min-h-screen max-w-full bg-transparent flex items-center justify-center p-0 m-0">
      <div className="mx-auto flex flex-row gap-6">
        {/* Main panel */}
        <div className={showSidebar ? "flex-1 transition-all duration-300" : "w-full transition-all duration-300"}>
          <AiToolsPanel ref={aiToolsPanelRef} setOpen={setOpen} setShowSidebar={setShowSidebar} showSidebar={showSidebar} pre_prompt={pre_prompt} />
          <LoginModal open={open} onClose={() => setOpen(false)} />
        </div>

        {/* Sidebar for search history */}
        {showSidebar && (
          <aside className="w-72 bg-[linear-gradient(135deg,_#7e8a98_0%,_#bfc9d1_40%,_#e0e6eb_100%)] dark:bg-[linear-gradient(135deg,_#23272f_0%,_#373f48_40%,_#555e6b_100%)] rounded-2xl shadow-2xl p-0 h-[calc(100vh-220px)] flex flex-col overflow-y-auto flex-shrink-0 transition-all duration-300 backdrop-blur-md bg-metallic">
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 rounded-t-2xl px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 backdrop-blur-md">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Search History</h2>
              <button
                className="ml-2 p-1 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
                onClick={() => setShowSidebar(false)}
                title="Hide search history"
                type="button"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-300" viewBox="0 0 24 24"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="px-4 pb-4 pt-2 flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : history.length === 0 ? (
                <div className="text-gray-400">No search history yet.</div>
              ) : (
                <ul className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      className="w-full text-left group bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 transition flex flex-col hover:border-cyan-400 hover:shadow-lg hover:bg-cyan-50/90 dark:hover:bg-cyan-950/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      title={item.title}
                      onClick={() => aiToolsPanelRef.current?.setAiMessage(item.result)}
                      type="button"
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-100 truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 text-right group-hover:text-cyan-500">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

