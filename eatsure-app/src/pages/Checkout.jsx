import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Phone, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, removeFromCart, cartTotal, cartCount } = useCart();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  if (cartCount === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg"
        >
          GO TO MENU
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 pb-24">
      <header className="sticky top-0 bg-white shadow-sm z-30 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Review Order</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-sm">Items in Cart ({cartCount})</h3>
            <span className="text-xs font-bold text-primary cursor-pointer hover:underline" onClick={() => navigate('/')}>+ Add More</span>
          </div>
          <div className="divide-y divide-gray-50">
            {cart.map((item) => (
              <div key={item.cartId} className="p-4 flex gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tight">
                    {item.selectedCustomizations.base.name}
                    {item.selectedCustomizations.sides.length > 0 && ` • ${item.selectedCustomizations.sides.map(s => s.name).join(', ')}`}
                    {item.selectedCustomizations.beverages.length > 0 && ` • ${item.selectedCustomizations.beverages.map(b => b.name).join(', ')}`}
                  </div>
                  <div className="mt-2 font-bold text-sm">₹{item.finalPrice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Phone */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
           <h3 className="font-bold text-sm flex items-center">
             <MapPin size={16} className="text-primary mr-2" />
             Delivery Details
           </h3>
           <div className="space-y-4">
             <div className="relative">
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Delivery Address</label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
                  placeholder="Street name, landmark, floor..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
             </div>
             <div className="relative">
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Phone Number</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <input 
                    type="tel" 
                    className="flex-1 bg-transparent text-sm outline-none font-semibold"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
             </div>
           </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-sm mb-4">Bill Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Item Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded">FREE</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Taxes & Charges</span>
              <span>₹0</span>
            </div>
            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between font-bold text-lg">
              <span>Total Pay</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex justify-center z-50 shadow-2xl">
        <button 
          onClick={() => (address && phone) ? navigate('/payment') : alert('Please fill in address and phone')}
          className="w-full max-w-lg bg-black text-white p-4 rounded-xl shadow-xl flex items-center justify-between font-bold active:scale-[0.98] transition-all"
        >
          <div className="text-lg">₹{cartTotal}</div>
          <div className="flex items-center uppercase tracking-wider text-sm">
            Proceed to Pay
            <ChevronRight size={18} className="ml-1" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
