import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function GuidesLandingPage() {
  return (
    <main className="bg-[#f8f9fc] min-h-screen pb-24">
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">Guides & How-Tos</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">Master forex trading with our expert guides, walkthroughs, and comparison tools.</h2>
      </header>
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Guide Card: Select Broker */}
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-start hover:-translate-y-1 hover:shadow-xl transition group focus-within:-translate-y-1 focus-within:shadow-xl outline-none" tabIndex={0}>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-cyan-600" />
            <span className="uppercase text-xs font-bold text-cyan-800 tracking-wider">Step-by-Step</span>
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">How to Choose a Forex Broker</h3>
          <p className="text-gray-700 mb-4 text-sm">Learn how to evaluate and compare brokers using key criteria like regulation, spreads, and platforms. Includes interactive comparison tools and real-world examples.</p>
          <Link href="/guides/select-broker" className="mt-auto inline-flex items-center gap-2 text-cyan-700 font-semibold hover:underline focus:underline group-hover:text-cyan-900 transition">
            Start Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Add more guide cards here as you launch new guides */}
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center opacity-60">
          <span className="text-cyan-600 mb-2"><BookOpen className="w-8 h-8" /></span>
          <h3 className="text-lg font-bold text-gray-400 mb-2">More Guides Coming Soon</h3>
          <p className="text-gray-400 text-sm text-center">Stay tuned for advanced trading strategies, platform walkthroughs, and more.</p>
        </div>
      </section>
    </main>
  );
}
