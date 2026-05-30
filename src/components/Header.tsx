import React from 'react';
import { Coffee, Download } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const Header: React.FC = () => {
  const tableNumber = useCartStore((state) => state.tableNumber);
  const isCategoryOpen = useCartStore((state) => state.isCategoryOpen);
  const activeTab = useCartStore((state) => state.activeTab);
  const businessInfo = useCartStore((state) => state.businessInfo);

  const showGreeting = activeTab === 'menu' && !isCategoryOpen;

  const handleDownloadMenu = () => {
    const menuText = `
===================================================
             THE ELEVATED APPETITE - MENU
===================================================

--- BREAKFAST ---
• Avocado Toast & Eggs ............................ ₹180
  Freshly mashed avocado on sourdough toast, with two poached eggs.
• Artisan Berry Waffles ........................... ₹150
  Crispy golden waffles topped with organic berries and sweet cream.

--- ARTISAN TEA ---
• Premium Jasmine Green ........................... ₹80
  High-grade loose leaf green tea brewed at 80°C.
• Artisan Herbal Chamomile ........................ ₹70
  Organic chamomile buds, lavender, and organic peel.

--- COFFEE ---
• Signature Latte Art ............................. ₹120
  Small-batch roasted Arabica espresso with microfoam.
• Nitro Cold Brew ................................. ₹140
  Slow-steeped chocolatey nitrogen cold brew on tap.

--- SUMMER COOLERS ---
• Citrus Sunset Cooler ............................ ₹90
  Blood orange, Meyer lemon, mint, and elderflower soda.
• Tropical Mango Passion .......................... ₹110
  Alphonso mango, passion fruit purée, and coconut water.

--- GREEN TEA (ग्रीन टी) ---
• Uji Matcha Ceremonial ........................... ₹130
  Authentic stone-ground frothy matcha from Kyoto.

--- FINE DINING DINNER (रात का भोजन) ---
• Pan-Seared Seabass .............................. ₹450
  Wild caught fillet with saffron risotto & citrus herb reduction.
• Truffle Ribeye & Mushroom ........................ ₹650
  USDA Prime steak glazed with black truffle butter & wild mushrooms.

===================================================
       Scan the QR code at your table to order!
===================================================
`;

    const blob = new Blob([menuText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Elevated_Appetite_Menu.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="pt-6 px-5 pb-2">
      {/* Brand Pill and Avatar Row */}
      <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${showGreeting ? 'mb-8' : 'mb-3'}`}>
        <div className="flex items-center gap-2.5">
          {/* Circular Brand Logo (Dynamic Image or Fallback Icon) */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#EFECE6] bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(46,21,19,0.06)]">
            {businessInfo.logoUrl ? (
              <img 
                src={businessInfo.logoUrl} 
                alt={businessInfo.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-logo-icon');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`fallback-logo-icon ${businessInfo.logoUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-white`}>
              <Coffee className="w-4.5 h-4.5 text-[#2E1513] stroke-[2.5]" />
            </div>
          </div>

          {/* Business / Brand Name */}
          <div className="bg-white border border-[#EFECE6] px-4 py-2 rounded-full shadow-[0_4px_16px_-4px_rgba(46,21,19,0.06)]">
            <span className="font-black text-[13px] tracking-widest text-[#2E1513] font-nunito uppercase whitespace-nowrap">
              {businessInfo.name}
            </span>
          </div>
        </div>

        
        {/* Download Menu Button (Only on Menu tab) */}
        {activeTab === 'menu' && (
          <button
            onClick={handleDownloadMenu}
            className="flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-[#E2D8CD] text-[#2E1513] border border-[#C27A3F] px-3.5 py-2 rounded-full text-[11px] font-black active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap ml-auto"
            title="Download Menu"
          >
            <Download className="w-3.5 h-3.5 text-[#C27A3F] stroke-[2.5]" />
            <span>Download</span>
          </button>
        )}
        

      </div>

      {/* Greeting Title */}
      {showGreeting && (
        <div className="animate-[fadeIn_0.5s_ease-out] mb-1">
          <h1 className="text-[26px] font-extrabold text-[#2E1513] font-nunito tracking-tight leading-tight">
            {tableNumber ? (
              <>
                Welcome back to <span className="text-[#16A34A]">Table {tableNumber.padStart(2, '0')}</span>,
              </>
            ) : (
              'Welcome back,'
            )}
          </h1>
        </div>
      )}
    </header>
  );
};
