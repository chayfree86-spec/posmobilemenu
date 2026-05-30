import React, { useEffect, useState } from 'react';
import { useCartStore } from './store/useCartStore';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { Search } from './components/Search';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { OrderStatus } from './components/OrderStatus';
import { BottomNav } from './components/BottomNav';
import { ItemSheet } from './components/ItemSheet';
import { CategoryStrip } from './components/CategoryStrip';
import { QrScannerModal } from './components/QrScannerModal';
import { Report } from './components/Report';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { PocketBaseService, type MenuItem } from './services/pocketbase';
import { FloatingCartHeader } from './components/FloatingCartHeader';
import { QrCode } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, tableNumber, setTableNumber, isCategoryOpen, setIsAuthModalOpen } = useCartStore();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [showQrToast, setShowQrToast] = useState(false);

  // Load menu items and business configuration from PocketBase on mount
  useEffect(() => {
    const initAppData = async () => {
      try {
        const data = await PocketBaseService.getMenu();
        setMenuItems(data);
        
        const businessData = await PocketBaseService.getBusinessInfo();
        useCartStore.getState().setBusinessInfo(businessData);
      } catch (err) {
        console.error('Error initializing app data:', err);
      } finally {
        setLoadingMenu(false);
      }
    };
    initAppData();
  }, []);

  // QR Scan Table Detection Simulated on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    
    if (tableParam) {
      setTableNumber(tableParam);
      
      const isExisting = !!localStorage.getItem('elevated_customer');
      if (!isExisting) {
        setIsAuthModalOpen(true);
      } else {
        setShowQrToast(true);
        const timer = setTimeout(() => {
          setShowQrToast(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [setTableNumber]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen selection:bg-[#2E1513]/10">
      <div className="mobile-viewport">
        {/* Automatic Table Detection Float Toast */}
        {showQrToast && tableNumber && (
          <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm font-nunito animate-[slideDown_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="bg-[#2E1513] text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-[0_12px_28px_rgba(46,21,19,0.22)] border border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C27A3F] flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="text-[13px] font-black leading-none">Table Detected</h5>
                  <p className="text-[11px] text-[#EFECE6] font-medium mt-0.5">
                    Order will be sent to Table {tableNumber.padStart(2, '0')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQrToast(false)}
                className="text-[11px] font-extrabold bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg"
              >
                Okay
              </button>
            </div>
          </div>
        )}

        {/* Brand Header */}
        <Header />

        {/* Sticky Floating Cart Header Card */}
        <FloatingCartHeader />

        {/* Loading Menu Spinner Overlay */}
        {loadingMenu ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 font-nunito">
            <div className="w-10 h-10 border-4 border-[#C27A3F] border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] font-bold text-[#8E8075]">Setting up artisan menu...</p>
          </div>
        ) : (
          /* Main Page Dynamic Render Content based on Active Tab */
          <main>
            {activeTab === 'menu' && (
              <CategoryGrid onSelectItem={handleSelectItem} menuItems={menuItems} />
            )}
            
            {activeTab === 'search' && (
              <Search onSelectItem={handleSelectItem} menuItems={menuItems} />
            )}

            {activeTab === 'cart' && (
              <CheckoutDrawer />
            )}

            {activeTab === 'status' && (
              <OrderStatus />
            )}

            {activeTab === 'report' && (
              <Report />
            )}
          </main>
        )}

        {/* Dynamic Item Customizer Sheet */}
        <ItemSheet item={selectedItem} onClose={() => setSelectedItem(null)} />

        {/* QR Code Scanner Overlay Modal */}
        <QrScannerModal
          onScanSuccess={async (table) => {
            setTableNumber(table);
            const isExisting = !!localStorage.getItem('elevated_customer');
            const { checkoutPending, setCheckoutPending, submitCurrentOrder } = useCartStore.getState();
            
            if (!isExisting) {
              setIsAuthModalOpen(true);
            } else {
              setShowQrToast(true);
              setTimeout(() => {
                setShowQrToast(false);
              }, 5000);
              
              if (checkoutPending) {
                setCheckoutPending(false);
                try {
                  await submitCurrentOrder();
                } catch (err) {
                  console.error('Auto-checkout scan failed:', err);
                }
              }
            }
          }}
        />

        {/* Customer Authentication & WhatsApp OTP Modal */}
        <CustomerAuthModal />

        {/* Horizontal Category Strip above Footer */}
        {activeTab === 'menu' && isCategoryOpen && (
          <CategoryStrip menuItems={menuItems} />
        )}

        {/* Bottom Floating Navigation Menu */}
        <BottomNav />
      </div>
    </div>
  );
};

export default App;
