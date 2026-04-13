import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Landmark, Smartphone, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Payment = () => {
  const { cartTotal } = useCart();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate('/success');
    }, 3000);
  };

  if (processing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-10 text-center">
        <div className="relative mb-10">
          <RefreshCw size={80} className="text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <ShieldCheck size={32} className="text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
        <p className="text-gray-500 animate-pulse">Please do not refresh or click back button.</p>
        
        <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full mt-10 overflow-hidden">
          <div className="bg-primary h-full rounded-full animate-progress-fill"></div>
        </div>
        
        <style>{`
          @keyframes progress-fill {
            from { width: 0%; }
            to { width: 100%; }
          }
          .animate-progress-fill {
            animation: progress-fill 3s linear forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 pb-24">
      <header className="sticky top-0 bg-white shadow-sm z-30 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/checkout')} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Payments</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between text-primary">
          <span className="text-sm font-bold uppercase tracking-wider">Total Amount to Pay</span>
          <span className="text-xl font-black">₹{cartTotal}</span>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest px-2">Popular Methods</h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <button onClick={handlePayment} className="w-full p-6 flex items-center text-left hover:bg-gray-50 transition-colors group">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 mr-4 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">UPI (Google Pay, PhonePe)</div>
                <div className="text-xs text-gray-400">Scan & Pay or link your ID</div>
              </div>
              <ChevronLeft size={20} className="rotate-180 text-gray-300" />
            </button>

            <button onClick={handlePayment} className="w-full p-6 flex items-center text-left hover:bg-gray-50 transition-colors group">
              <div className="bg-orange-50 p-3 rounded-xl text-orange-600 mr-4 group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Credit / Debit Cards</div>
                <div className="text-xs text-gray-400">Visa, Mastercard, RuPay, Amex</div>
              </div>
              <ChevronLeft size={20} className="rotate-180 text-gray-300" />
            </button>

            <button onClick={handlePayment} className="w-full p-6 flex items-center text-left hover:bg-gray-50 transition-colors group">
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600 mr-4 group-hover:scale-110 transition-transform">
                <Landmark size={24} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Net Banking</div>
                <div className="text-xs text-gray-400">All major banks supported</div>
              </div>
              <ChevronLeft size={20} className="rotate-180 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="p-10 flex flex-col items-center opacity-40">
           <ShieldCheck size={48} className="text-gray-400 mb-2" />
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center">100% Secure & Encrypted Payments</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
