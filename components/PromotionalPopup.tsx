'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Zap,
  Shield
} from 'lucide-react';

export default function PromotionalPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    // Show popup after 3 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    // Handle claim action
    console.log('Bonus claimed!');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            onClick={handleClose}
          />
          
          {/* Popup - 16:9 Ratio, Perfectly Centered */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.5 
              }}
              className="w-full max-w-4xl"
              style={{ aspectRatio: '16/9' }}
            >
              <Card className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full z-10 w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>

                <CardContent className="h-full flex p-0">
                  {/* Left Section - Main Content */}
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    {/* Header Section */}
                    <div className="mb-6">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none mb-4 text-sm font-bold px-4 py-2 shadow-lg">
                        🔥 LIMITED TIME OFFER
                      </Badge>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                        Get <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">$1,000</span> Cash Bonus
                      </h2>
                      
                      <p className="text-lg text-cyan-200 mb-4">
                        Trade 10 Lots & Receive Instant Cash Reward
                      </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-sm text-cyan-100">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <Zap className="w-4 h-4 text-green-400" />
                        </div>
                        <span>Instant Processing</span>
                      </div>
                      <div className="flex items-center text-sm text-cyan-100">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <DollarSign className="w-4 h-4 text-green-400" />
                        </div>
                        <span>No Hidden Fees</span>
                      </div>
                      <div className="flex items-center text-sm text-cyan-100">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <Shield className="w-4 h-4 text-green-400" />
                        </div>
                        <span>Fully Regulated</span>
                      </div>
                      <div className="flex items-center text-sm text-cyan-100">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <span>Professional Platform</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mb-4"
                    >
                      <Button
                        onClick={handleClaim}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-6 text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 group border-0"
                      >
                        <div className="flex items-center justify-center">
                          Claim Your $1,000 Bonus Now
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Button>
                    </motion.div>

                    {/* Social Proof */}
                    <div className="text-center">
                      <p className="text-sm text-cyan-200">
                        <span className="font-bold text-cyan-400">15,847</span> traders claimed this month
                      </p>
                    </div>
                  </div>

                  {/* Right Section - RS Finance Branding & Timer */}
                  <div className="w-80 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border-l border-cyan-400/20 p-8 flex flex-col justify-center">
                    {/* Countdown Timer */}
                    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30 w-full text-center mb-8">
                      <div className="flex items-center justify-center text-white/90 text-sm mb-3">
                        <Clock className="w-4 h-4 mr-2" />
                        Offer Expires In:
                      </div>
                      <div className="text-2xl font-mono font-bold text-cyan-300 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-white/70">
                        Hours : Minutes : Seconds
                      </div>
                    </div>

                    {/* RS Finance Branding */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 w-full text-center">
                      {/* Logo and Brand */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-white/80 leading-tight">Powered by</div>
                          <div className="text-xl font-bold text-cyan-400 leading-tight">RS Finance</div>
                        </div>
                      </div>
                      
                      {/* Trust Indicators */}
                      <div className="flex items-center justify-center space-x-3 text-sm text-cyan-200 mb-4">
                        <span className="px-2 py-1 bg-cyan-500/20 rounded-lg">Regulated</span>
                        <span className="px-2 py-1 bg-cyan-500/20 rounded-lg">Trusted</span>
                        <span className="px-2 py-1 bg-cyan-500/20 rounded-lg">Secure</span>
                      </div>
                      
                      {/* Disclaimer */}
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-white/60 text-center leading-relaxed">
                          *T&C apply. Risk warning: Trading involves substantial risk.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}