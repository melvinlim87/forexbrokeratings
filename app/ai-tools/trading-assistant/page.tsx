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
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center p-0 m-0">
      <div className="w-full max-w-6xl mx-auto flex flex-row gap-6">
        {/* Sidebar for search history */}
        {showSidebar && (
          <aside className="w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 h-[calc(100vh-120px)] flex flex-col overflow-y-auto flex-shrink-0 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Your Search History</h2>
              <button
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowSidebar(false)}
                title="Hide search history"
                type="button"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
              </button>
            </div>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : history.length === 0 ? (
              <div className="text-gray-400">No search history yet.</div>
            ) : (
              <ul className="space-y-4">
                {history.map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left font-semibold text-gray-700 dark:text-gray-200 truncate hover:bg-cyan-100 dark:hover:bg-cyan-900 rounded px-2 py-1 transition border-b border-gray-100 dark:border-gray-800"
                    title={item.title}
                    onClick={() => aiToolsPanelRef.current?.setAiMessage(item.result)}
                    type="button"
                  >
                    <li className="">{item.title}</li>
                    <div className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</div>
                  </button>
                ))}
              </ul>
            )}
          </aside>
        )}
        {/* Main panel */}
        <div className={showSidebar ? "flex-1 transition-all duration-300" : "w-full transition-all duration-300"}>
          <AiToolsPanel ref={aiToolsPanelRef} setOpen={setOpen} setShowSidebar={setShowSidebar} showSidebar={showSidebar} pre_prompt={pre_prompt} />
          <LoginModal open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}

