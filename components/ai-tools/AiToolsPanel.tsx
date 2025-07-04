import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Copy } from "lucide-react";

// Example quick prompts
const quickPrompts = [
  "Compare IC Markets vs XM",
  "Best ECN brokers",
  "FCA regulated brokers",
  "Lowest spread brokers"
];

export default function AiToolsPanel() {
  return (
    <div className="w-full mx-auto rounded-2xl shadow-xl bg-gradient-to-tr from-[#6f3deb] via-[#4473ea] to-[#21d4fd] p-1 mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 ">
        <div className="bg-white/10 p-2 rounded-xl">
          <Bot className="text-white" size={18} />
        </div>
        <div className="text-white rounded-full flex items-center justify-center">
          <span className="font-bold text-lg">AI Broker Analyzer</span>
        </div>
        {/* <span className="ml-2 text-xs text-green-500 font-semibold">● Online</span>
        <span className="ml-2 text-xs text-gray-400">Powered by BrokerGPT 72B VL</span> */}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3">
        {/* Welcome Message */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-100 text-left">Hello! I'm your AI forex broker analyst powered by advanced AI. I can help you with:</div>
        </div>
        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mb-4 bg-gray-100 p-3">
          {quickPrompts.map((prompt) => (
            <Button key={prompt} size="sm" variant="outline" className="rounded-full px-4 py-1 text-xs bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              {prompt}
            </Button>
          ))}
        </div>
        {/* Input Field */}
        <form className="flex items-center gap-2 rounded-xl py-2 mt-2">
          <input
            type="text"
            className="flex-1 bg-transparent border border-gray-100 rounded-xl outline-none px-2 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Analyse any broker's regulations, promotions, ratings, spreads, or compare brokers..."
          />
          <Button type="submit" size="icon" className="bg-gradient-to-tr from-purple-500 to-cyan-400 text-white shadow-md">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
