import React from 'react';
import { Search as SearchIcon, Plus, EyeOff, Mic } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { MenuItem } from '../services/pocketbase';
import { SafeImage } from './SafeImage';

interface SearchProps {
  onSelectItem: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

export const Search: React.FC<SearchProps> = ({ onSelectItem, menuItems }) => {
  const { searchQuery, setSearchQuery, cart } = useCartStore();
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  // Initialize Speech Recognition
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'hi-IN'; // Listen to Hindi / Indian English perfectly!

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          // Remove trailing period if recognition adds one
          const cleanText = transcript.replace(/\.$/, '');
          setSearchQuery(cleanText);
        }
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [setSearchQuery]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice Search is not supported in this browser. Please use Google Chrome or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = menuItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-5 pb-48 font-nunito animate-[fadeIn_0.4s_ease-out]">
      <h2 className="text-[20px] font-extrabold text-[#2E1513] border-b border-[#F4EFEA] pb-3 mb-5">
        Search Menu
      </h2>

      {/* Search Results */}
      {searchQuery ? (
        filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative flex gap-4 bg-white border border-[#FAF6F0] rounded-[24px] p-3 shadow-[0_4px_16px_rgba(46,21,19,0.03)] cursor-pointer hover:border-[#E2D8CD] active:scale-[0.99] transition-all duration-200"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-[16px] overflow-hidden flex-shrink-0 bg-[#2E1513]/5">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallbackType={item.category === 'Artisan Tea' || item.category === 'Coffee' || item.category === 'Green Tea' || item.category === 'Summer' ? 'drink' : 'food'}
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between py-0.5 flex-grow pr-1">
                  <div>
                    <span className="text-[9px] font-extrabold text-[#C27A3F] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="font-extrabold text-[15px] text-[#2E1513] leading-tight group-hover:text-[#C27A3F] transition-colors mt-0.5">
                      {item.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-[15px] text-[#2E1513]">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <button
                      className="bg-[#FAF6F0] text-[#2E1513] hover:bg-[#C27A3F] hover:text-white border border-[#EBE3D7] hover:border-[#C27A3F] p-1 rounded-full shadow-sm transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#8E8075] space-y-3">
            <EyeOff className="w-10 h-10" />
            <p className="font-bold text-[14px]">No dishes matched your search</p>
          </div>
        )
      ) : (
        /* Popular Searches Suggestions with Real Menu Images inside 4-Column Square Grid */
        <div className="space-y-4 pt-1">
          <h4 className="text-[12px] font-extrabold text-[#7D7067] tracking-widest uppercase px-0.5">
            Popular Searches
          </h4>
          <div className="grid grid-cols-4 gap-3 py-2.5">
            {[
              'Matcha', 'Coffee', 'Waffle', 'Seabass',
              'Avocado', 'Steak', 'Chamomile', 'Honey',
              'Mango', 'Jasmine', 'Latte', 'Cold Brew',
              'Sunset', 'Berry', 'Egg', 'Ribeye'
            ].map((tag) => {
              // Find matching item from menuItems to extract real visual image
              const matchedItem = menuItems.find(
                (item) =>
                  item.name.toLowerCase().includes(tag.toLowerCase()) ||
                  item.category.toLowerCase().includes(tag.toLowerCase())
              );
              
              const imageSrc = matchedItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60';

              const cartQty = matchedItem 
                ? cart
                    .filter((cartItem) => cartItem.id === matchedItem.id)
                    .reduce((sum, item) => sum + item.quantity, 0)
                : 0;

              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (matchedItem) {
                      onSelectItem(matchedItem);
                    } else {
                      setSearchQuery(tag);
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 focus:outline-none group active:scale-95 transition-all duration-200"
                >
                  {/* Square Box aspect-square Container */}
                  <div className={`w-full aspect-square rounded-[18px] overflow-hidden border-2 shadow-[0_4px_12px_rgba(46,21,19,0.05)] bg-[#2E1513]/5 relative transition-all duration-300 ${
                    cartQty > 0 ? 'border-[#C27A3F]' : 'border-white group-hover:border-[#C27A3F]'
                  }`}>
                    <SafeImage
                      src={imageSrc}
                      alt={tag}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackType={tag === 'Coffee' || tag === 'Chamomile' || tag === 'Matcha' ? 'drink' : 'food'}
                    />
                    
                    {/* Floating Quantity Badge Overlay */}
                    {cartQty > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-[#C27A3F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-[0_2px_6px_rgba(194,122,63,0.3)] animate-[scaleIn_0.2s_ease-out]">
                        {cartQty}
                      </span>
                    )}
                  </div>
                  <span className="text-[11.5px] font-black text-[#2E1513] group-hover:text-[#C27A3F] transition-colors leading-none tracking-tight text-center truncate w-full">
                    {tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Bottom Search Input Field */}
      <div className="fixed bottom-[76px] left-0 right-0 max-w-[480px] mx-auto z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#F0EAE1] p-4 shadow-[0_-4px_16px_rgba(46,21,19,0.02)]">
        <div className="relative flex items-center w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8075]" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={isListening ? "Listening..." : "Search tea, coffee, waffles..."}
            className="w-full bg-white border border-[#EFECE6] rounded-2xl pl-12 pr-12 py-3.5 text-[15px] font-semibold text-[#2E1513] placeholder-[#8E8075] focus:border-[#C27A3F] focus:ring-2 focus:ring-[#C27A3F]/15 outline-none shadow-[0_2px_8px_-2px_rgba(46,21,19,0.03)] transition-all duration-200"
          />
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`absolute right-3.5 p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] animate-pulse'
                : 'text-[#8E8075] hover:text-[#2E1513] hover:bg-[#FAF6F0] active:scale-90'
            }`}
            title="Voice Search"
          >
            <Mic className={`w-5 h-5 stroke-[2] ${isListening ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
