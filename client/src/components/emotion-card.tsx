import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { EmotionCategory } from "@shared/schema";

interface EmotionCardProps {
  emotion: EmotionCategory;
  onClick: () => void;
  className?: string;
}

const emotionConfig = {
  anxious: {
    title: "When you're",
    subtitle: "Anxious",
    icon: "☁️",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    border: "border-blue-200 dark:border-blue-700/50",
    textColor: "text-blue-600 dark:text-blue-300",
    iconColor: "text-blue-400"
  },
  happy: {
    title: "When you're",
    subtitle: "Happy", 
    icon: "☀️",
    gradient: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
    border: "border-yellow-200 dark:border-yellow-700/50",
    textColor: "text-yellow-600 dark:text-yellow-300",
    iconColor: "text-yellow-400"
  },
  sad: {
    title: "When you're",
    subtitle: "Sad",
    icon: "💔",
    gradient: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
    border: "border-indigo-200 dark:border-indigo-700/50",
    textColor: "text-indigo-600 dark:text-indigo-300",
    iconColor: "text-indigo-400"
  },
  grateful: {
    title: "When you're",
    subtitle: "Grateful",
    icon: "🙏",
    gradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    border: "border-green-200 dark:border-green-700/50",
    textColor: "text-green-600 dark:text-green-300",
    iconColor: "text-green-400"
  },
  strength: {
    title: "When you need",
    subtitle: "Strength",
    icon: "✊",
    gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
    border: "border-red-200 dark:border-red-700/50",
    textColor: "text-red-600 dark:text-red-300",
    iconColor: "text-red-400"
  },
  lonely: {
    title: "When you're",
    subtitle: "Lonely",
    icon: "👤",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    border: "border-purple-200 dark:border-purple-700/50",
    textColor: "text-purple-600 dark:text-purple-300",
    iconColor: "text-purple-400"
  },
  guidance: {
    title: "When you need",
    subtitle: "Guidance",
    icon: "🧭",
    gradient: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
    border: "border-teal-200 dark:border-teal-700/50",
    textColor: "text-teal-600 dark:text-teal-300",
    iconColor: "text-teal-400"
  },
  angry: {
    title: "When you're",
    subtitle: "Angry",
    icon: "🔥",
    gradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    border: "border-orange-200 dark:border-orange-700/50",
    textColor: "text-orange-600 dark:text-orange-300",
    iconColor: "text-orange-400"
  },
  anything: {
    title: "When you feel anything",
    subtitle: "and no one is there to listen",
    icon: "❤️",
    gradient: "from-gold-50 to-peaceful-50 dark:from-gold-900/20 dark:to-peaceful-800/20",
    border: "border-2 border-gold-200 dark:border-gold-700/50",
    textColor: "text-gray-800 dark:text-cream-50",
    iconColor: "text-gold-400"
  }
};

export function EmotionCard({ emotion, onClick, className = "" }: EmotionCardProps) {
  const config = emotionConfig[emotion];
  const isSpecial = emotion === "anything";
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={className}
    >
      <Card 
        className={`
          cursor-pointer bg-gradient-to-br ${config.gradient} 
          ${config.border} rounded-2xl p-4 transition-all duration-200 
          shadow-sm hover:shadow-md ${isSpecial ? 'p-6' : ''}
        `}
        onClick={onClick}
      >
        <div className={`flex flex-col items-center text-center space-y-2 ${isSpecial ? 'space-y-3' : ''}`}>
          <div className={`text-2xl mb-1 ${isSpecial ? 'flex items-center space-x-2' : ''}`}>
            <span>{config.icon}</span>
            {isSpecial && <span className="text-peaceful-400 text-xl opacity-60">📞</span>}
          </div>
          <h3 className={`font-medium text-gray-800 dark:text-cream-50 text-sm ${isSpecial ? 'font-serif font-semibold text-lg' : ''}`}>
            {config.title}
          </h3>
          <p className={`font-serif font-semibold ${config.textColor} ${isSpecial ? 'text-sm text-gray-600 dark:text-gray-300 leading-relaxed' : ''}`}>
            {config.subtitle}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
