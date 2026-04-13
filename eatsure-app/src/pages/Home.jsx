import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Filter, ChevronRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { brands, foodItems, banners } from '../data/mockData';
import { useCart } from '../context/CartContext';
import CustomizationDrawer from '../components/CustomizationDrawer';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [searchTerm, selectedBrand]);

  return (
    <div className="flex-1 pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center text-primary font-bold text-xs uppercase tracking-wider">
              <MapPin size={14} className="mr-1" />
              Delivery To
            </div>
            <div className="font-semibold text-sm truncate max-w-[150px]">Home - HSR Layout, BLR...</div>
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for dishes, brands..." 
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* Banners */}
        <div className="mb-8 overflow-hidden rounded-2xl h-40 relative group">
          <img 
            src={banners[0]} 
            alt="Offer" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">50% OFF</h2>
            <p className="text-sm opacity-90">On your first order from Faasos</p>
            <button className="mt-3 bg-white text-black text-xs font-bold py-2 px-4 rounded-full w-fit">ORDER NOW</button>
          </div>
        </div>

        {/* Brand Filters */}
        <div className="mb-8 overflow-x-auto whitespace-nowrap pb-2 custom-scrollbar">
          <div className="flex gap-3">
            <button 
              onClick={() => setSelectedBrand('All')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedBrand === 'All' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              All Brands
            </button>
            {brands.map(brand => (
              <button 
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedBrand === brand ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Food List */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg flex items-center justify-between">
            Recommended Items
            <span className="text-gray-400 text-xs font-normal">Showing {filteredItems.length} dishes</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-sm flex items-center justify-center p-0.5 border-2 ${item.isVeg ? 'border-green-600' : 'border-red-800'}`}>
                    <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-800'}`}></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.brand}</span>
                    <div className="flex items-center text-xs font-bold text-gray-700 bg-yellow-400 px-1 rounded">
                      <Star size={10} fill="currentColor" className="mr-0.5" />
                      {item.rating}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold">₹{item.price}</span>
                    <button 
                      className="bg-white text-primary border border-primary/30 hover:bg-primary/5 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-white p-4 rounded-xl shadow-xl flex items-center justify-between pointer-events-auto active:scale-[0.98] transition-all"
            >
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <ShoppingCart size={20} />
                </div>
                <div className="text-left">
                  <div className="text-xs opacity-75 font-semibold leading-none">{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</div>
                  <div className="font-bold">₹{cartTotal}</div>
                </div>
              </div>
              <div className="flex items-center font-bold text-sm uppercase tracking-wider">
                View Cart
                <ChevronRight size={18} className="ml-1" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Customization Drawer */}
      {selectedItem && (
        <CustomizationDrawer 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default Home;
