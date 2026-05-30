import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface QrScannerModalProps {
  onScanSuccess: (tableNum: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ onScanSuccess }) => {
  const { isQrScannerOpen, setIsQrScannerOpen } = useCartStore();

  // Dynamically synthesize a crisp, premium audio "beep" sound offline
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // Sweet 1000Hz beep
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      oscillator.start();
      // Drop volume exponentially to create a clean, short beep
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (err) {
      console.log('Web Audio blocked or unsupported:', err);
    }
  };

  // Simulate scanning a random table (e.g., Table 01 to 12) after 1.8 seconds of scanning animation
  React.useEffect(() => {
    if (!isQrScannerOpen) return;

    const timer = setTimeout(() => {
      const randomTable = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      playBeep();
      onScanSuccess(randomTable);
      setIsQrScannerOpen(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isQrScannerOpen, onScanSuccess, setIsQrScannerOpen]);

  if (!isQrScannerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5 font-nunito">
        {/* Backdrop Transparent Blur Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#2E1513]/75 backdrop-blur-[5px]"
          onClick={() => setIsQrScannerOpen(false)}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-[#FAF6F0] w-full max-w-sm rounded-[32px] overflow-hidden shadow-[0_24px_50px_rgba(46,21,19,0.3)] z-10 p-6 flex flex-col items-center text-center border border-[#F2ECE4]"
        >
          {/* Close Circular Button */}
          <button
            onClick={() => setIsQrScannerOpen(false)}
            className="absolute top-4 right-4 bg-white/80 text-[#2E1513] border border-[#EFECE6] p-2 rounded-full shadow-[0_4px_12px_rgba(46,21,19,0.06)] active:scale-90 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Header Title */}
          <div className="mt-2 space-y-1">
            <h3 className="text-[19px] font-black text-[#2E1513]">QR Code Scanner</h3>
            <p className="text-[12.5px] text-[#7D7067] font-semibold max-w-[240px]">
              Align the QR code on your table inside the frame
            </p>
          </div>

          {/* Animated Laser Viewfinder Frame */}
          <div className="w-48 h-48 border-4 border-dashed border-[#C27A3F] rounded-[24px] relative overflow-hidden bg-black/10 shadow-[inner_0_0_15px_rgba(0,0,0,0.2)] my-6 flex items-center justify-center">
            {/* Pulsing overlay QR vector */}
            <QrCode className="w-20 h-20 text-[#2E1513]/10 stroke-[1.5]" />

            {/* Glowing gold laser line sliding vertically */}
            <motion.div
              animate={{ 
                top: ['0%', '100%', '0%'] 
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="absolute left-0 right-0 h-1 bg-[#C27A3F] shadow-[0_0_8px_#C27A3F] z-10"
            />
          </div>


        </motion.div>
      </div>
    </AnimatePresence>
  );
};
