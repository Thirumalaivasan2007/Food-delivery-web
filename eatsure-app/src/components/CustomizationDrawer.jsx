import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CustomizationDrawer = ({ item, onClose }) => {
  const [selectedBase, setSelectedBase] = useState(item.customizations.base[0]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedBevs, setSelectedBevs] = useState([]);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const { addToCart } = useCart();

  useEffect(() => {
    let extra = selectedBase.price;
    selectedSides.forEach(s => extra += s.price);
    selectedBevs.forEach(b => extra += b.price);
    setTotalPrice(item.price + extra);
  }, [selectedBase, selectedSides, selectedBevs, item.price]);

  const toggleSide = (side) => {
    if (selectedSides.find(s => s.id === side.id)) {
      setSelectedSides(selectedSides.filter(s => s.id !== side.id));
    } else {
      setSelectedSides([...selectedSides, side]);
    }
  };

  const toggleBev = (bev) => {
    if (selectedBevs.find(b => b.id === bev.id)) {
      setSelectedBevs(selectedBevs.filter(b => b.id !== bev.id));
    } else {
      setSelectedBevs([...selectedBevs, bev]);
    }
  };

  const handleAdd = () => {
    addToCart(item, { base: selectedBase, sides: selectedSides, beverages: selectedBevs }, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-4xl mx-auto rounded-t-3xl relative p-6 animate-slide-up overflow-y-auto max-h-[90vh] custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row gap-6 mb-8 mt-2">
          <div className="w-full md:w-1/3">
            <img src={item.image} alt={item.name} className="w-full aspect-video md:aspect-square object-cover rounded-2xl shadow-lg" />
          </div>
          <div className="flex-1">
            <div className={`mb-2 w-4 h-4 rounded-sm flex items-center justify-center p-0.5 border-2 ${item.isVeg ? 'border-green-600' : 'border-red-800'}`}>
              <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-800'}`}></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.description}</p>
            
            <div className="grid grid-cols-4 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="text-center">
                 <div className="text-[10px] text-gray-400 font-bold uppercase">Cal</div>
                 <div className="font-bold text-sm">{item.nutrition.calories}</div>
               </div>
               <div className="text-center border-l border-gray-200">
                 <div className="text-[10px] text-gray-400 font-bold uppercase">Prot</div>
                 <div className="font-bold text-sm">{item.nutrition.protein}g</div>
               </div>
               <div className="text-center border-l border-gray-200">
                 <div className="text-[10px] text-gray-400 font-bold uppercase">Fats</div>
                 <div className="font-bold text-sm">{item.nutrition.fats}g</div>
               </div>
               <div className="text-center border-l border-gray-200">
                 <div className="text-[10px] text-gray-400 font-bold uppercase">Carbs</div>
                 <div className="font-bold text-sm">{item.nutrition.carbs}g</div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Base Options */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Select Wrap Base</h3>
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold text-gray-500 uppercase">Required</span>
            </div>
            <div className="space-y-3">
              {item.customizations.base.map(base => (
                <label key={base.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer active:scale-[0.99] transition-all">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="base" 
                      className="w-5 h-5 accent-primary" 
                      checked={selectedBase.id === base.id}
                      onChange={() => setSelectedBase(base)}
                    />
                    <span className="ml-3 font-semibold text-sm">{base.name}</span>
                  </div>
                  <span className="text-sm font-bold">+{base.price > 0 ? `₹${base.price}` : 'FREE'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sides */}
          <div>
            <h3 className="font-bold mb-4">Add Sides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.customizations.sides.map(side => (
                <label key={side.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer active:scale-[0.99] transition-all">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-primary rounded" 
                      checked={!!selectedSides.find(s => s.id === side.id)}
                      onChange={() => toggleSide(side)}
                    />
                    <span className="ml-3 font-semibold text-sm">{side.name}</span>
                  </div>
                  <span className="text-sm font-bold">₹{side.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Beverages */}
          <div>
            <h3 className="font-bold mb-4">Beverages & Desserts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-32">
              {item.customizations.beverages.map(bev => (
                <label key={bev.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer active:scale-[0.99] transition-all">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-primary rounded" 
                      checked={!!selectedBevs.find(b => b.id === bev.id)}
                      onChange={() => toggleBev(bev)}
                    />
                    <span className="ml-3 font-semibold text-sm">{bev.name}</span>
                  </div>
                  <span className="text-sm font-bold">₹{bev.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex justify-center z-50">
          <button 
            onClick={handleAdd}
            className="w-full max-w-lg bg-primary text-white p-4 rounded-xl shadow-xl flex items-center justify-between font-bold active:scale-[0.98] transition-all"
          >
            <div>
              <div className="text-[10px] opacity-75 uppercase tracking-widest text-left">Total Price</div>
              <div className="text-lg">₹{totalPrice}</div>
            </div>
            <div className="flex items-center uppercase tracking-wider text-sm">
              Add to Cart
              <ChevronRight size={18} className="ml-1" />
            </div>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default CustomizationDrawer;
