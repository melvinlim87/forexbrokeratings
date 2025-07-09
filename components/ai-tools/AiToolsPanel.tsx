import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Clock, Copy } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { storeAIResult } from '@/lib/supabase';

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

export const AiToolsPanel = forwardRef(function AiToolsPanel({ setOpen, setShowSidebar, showSidebar, pre_prompt }: { setOpen: (open: boolean) => void, setShowSidebar: (showSidebar: boolean) => void, showSidebar: boolean, pre_prompt: string }, ref) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  type Message = { sender: 'ai' | 'user'; text: string, date: string };
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I am your AI broker analyst powered by advanced AI \nI can help you with: \n  - Broker comparisons and reviews\n  - Regulatory information\n  - Trading conditions analysis\n  - Platform recommendations\n  - Market insights\nWhat would you like to know about forex brokers?", date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) }
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({ top: messagesEndRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Handle pre_prompt only when it changes
  useEffect(() => {
    if (pre_prompt && pre_prompt.length > 0) {
      handleAITools(pre_prompt);
    }
  }, [pre_prompt]);

  const handleAITools = async (prompt: string) => {
    if (!user || user.email_confirmed_at == false) {
      setOpen(true);
      return;
    }
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: prompt, date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) }, ]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Analysing...', date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) } ]);
    }, 500);
    setPrompt("");
    setLoading(true)
    // messagesEndRef.current?.scrollTo({ top: messagesEndRef.current?.scrollHeight, behavior: 'smooth' });
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

        // if usePrev is true, do not store
        // but if data.user_id is different with current user id, store
        if (!data.usePrev && data.user_id && data.user_id !== user.user_detail?.id) {
          await storeAIResult(user.user_detail?.id, prompt, data.result);
        }
        await setMessages(prev => {
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
  // Expose setAiMessage for parent
  useImperativeHandle(ref, () => ({
    setAiMessage: (text: string) => {
      setMessages(prev => [...prev, { sender: 'ai', text, date: new Date().toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',second: '2-digit',hour12: true,}) }]);
    }
  }));

  return (
    <div className="w-full h-[calc(100vh-120px)] md:h-[calc(100vh-220px)] mx-auto rounded-2xl shadow-xl bg-gradient-to-r from-cyan-400 to-purple-400 p-1 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-3 ">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl">
            <Bot className="text-white" size={18} />
          </div>
          <div className="text-white rounded-full flex items-center justify-center">
            <span className="font-bold text-lg">AI Broker Analyzer</span>
          </div>
        </div>
        <div>
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 hover:bg-white/10" onClick={() => setShowSidebar(!showSidebar)}> 
            <Clock className="text-white" size={18} />
          </button>
        </div>
        {/* <span className="ml-2 text-xs text-green-500 font-semibold">● Online</span>
        <span className="ml-2 text-xs text-gray-400">Powered by BrokerGPT 72B VL</span> */}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 h-[calc(100vh-180px)] md:h-[calc(100vh-280px)]">
        {/* Message Container */}
        <div ref={messagesEndRef} className="h-[calc(100vh-460px)] bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-800 overflow-y-auto flex flex-col gap-2">
          {messages.map((msg, idx) => (
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
                {msg.text}
                <br />
                <span className={msg.sender === 'user' ? "text-xs text-white" : "text-xs text-gray-500"}>{msg.date}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mb-4 bg-gray-100 p-3 grid md:grid-cols-4 grid-cols-2 overflow-x-auto">
          {quickPrompts.map((prompt) => (
            <Button disabled={loading} key={prompt} size="sm" variant="outline" className=" rounded-full px-4 py-1 text-xs bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 " onClick={() => handleAITools(prompt)}>
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
          <Button disabled={loading} size="icon" className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-md" onClick={() => handleAITools(prompt)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
          </Button>
        </div>
      </div>
    </div>
  );
})
