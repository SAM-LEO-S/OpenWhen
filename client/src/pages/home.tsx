import { motion } from "framer-motion";
import { EmotionCard } from "@/components/emotion-card";
import { Wifi, WifiOff, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import type { EmotionCategory } from "@shared/schema";

const emotionCategories: EmotionCategory[] = [
  "anxious", "happy", "sad", "grateful", 
  "strength", "lonely", "guidance", "angry"
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleEmotionClick = (emotion: EmotionCategory) => {
    if (emotion === "anything") {
      setLocation("/special-verse");
    } else {
      setLocation(`/verse/${emotion}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 animate-fade-in max-w-md mx-auto px-4 py-6"
    >
      {/* Welcome Section */}
      <div className="text-center space-y-3">
        <motion.div 
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400 to-peaceful-400 rounded-full mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="text-white text-xl" size={24} />
        </motion.div>
        <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-cream-50">
          How are you feeling today?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Choose a card that matches your heart, and let God's Word speak to your soul.
        </p>
      </div>

      {/* Emotion Cards Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {emotionCategories.map((emotion, index) => (
          <motion.div
            key={emotion}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EmotionCard
              emotion={emotion}
              onClick={() => handleEmotionClick(emotion)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Special Card */}
      <div className="mt-6">
        <EmotionCard
          emotion="anything"
          onClick={() => handleEmotionClick("anything")}
        />
      </div>

      {/* Footer */}
      <div className="text-center py-4 space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Verses powered by Bible API
        </p>
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </motion.div>
  );
}
