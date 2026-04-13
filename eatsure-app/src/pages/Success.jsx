import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart on success
    clearCart();

    // Browser Push Notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Order Confirmed! 🍔', {
          body: 'Your order is confirmed and being prepared!',
          icon: '/vite.svg'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Order Confirmed! 🍔', {
              body: 'Your order is confirmed and being prepared!',
              icon: '/vite.svg'
            });
          }
        });
      }
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white overflow-hidden">
      <div className="scale-0 animate-pop-in relative">
        <div className="bg-green-100 p-8 rounded-full">
           <CheckCircle2 size={100} className="text-green-600" />
        </div>
        <div className="absolute top-0 -right-4 bg-primary p-3 rounded-full shadow-lg animate-bounce delay-300">
           <ShoppingBag size={24} className="text-white" />
        </div>
      </div>

      <div className="text-center mt-10 animate-fade-up opacity-0">
        <h2 className="text-3xl font-black mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-2">Thank you for choosing CraveBites.</p>
        <div className="inline-flex items-center text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10 mb-8">
           <MapPin size={14} className="mr-1" />
           ETA: 25-35 Minutes
        </div>
        
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
           <button 
             onClick={() => navigate('/')}
             className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-xl active:scale-[0.98] transition-all"
           >
             BACK TO HOME
           </button>
           <button 
             className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
           >
             <Share2 size={18} />
             Track Order
           </button>
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out 0.4s forwards;
        }
      `}</style>
    </div>
  );
};

export default Success;
