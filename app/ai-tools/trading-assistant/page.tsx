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
import { X, Search, ChevronRight, MessageSquare } from 'lucide-react';

// --- ChatHistorySidebar component ---
const ChatHistorySidebar = ({ chatHistory, isOpen, onClose }: { chatHistory: any[], isOpen: boolean, onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredHistory = chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-[80px] right-0 h-[calc(100vh-64px)] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
        w-80 max-w-[85vw]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:top-0 lg:h-full lg:relative lg:translate-x-0 lg:shadow-lg lg:z-auto
        ${isOpen ? 'lg:block' : 'lg:hidden'}
      `}>
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Search History</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors hidden lg:block"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* History List */}
        <div className="overflow-y-auto h-[calc(100vh-220px)] lg:h-[calc(100vh-360px)]">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 p-4">
              <MessageSquare className="w-12 h-12 mb-3" />
              <p className="text-base font-medium">No conversations found</p>
              <p className="text-sm text-center">Try adjusting your search</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filteredHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate mb-1 group-hover:text-blue-600 text-sm">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-2 mt-1 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

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
  const [showSidebar, setShowSidebar] = useState(false);

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
        <ChatHistorySidebar chatHistory={history} isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      </div>
    </div>
  );
}

