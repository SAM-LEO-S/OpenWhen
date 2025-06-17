import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share, RefreshCw, Quote } from "lucide-react";
import type { Verse } from "@shared/schema";

interface VerseCardProps {
  verse: Verse;
  onShare: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function VerseCard({ verse, onShare, onRefresh, isLoading = false }: VerseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Bible Verse Card */}
      <Card className="bg-white dark:bg-deep-900 rounded-2xl shadow-lg border border-cream-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Quote className="text-gold-400 text-lg mt-1 flex-shrink-0" size={18} />
            <div className="space-y-3">
              <p className="text-gray-800 dark:text-cream-50 leading-relaxed font-serif text-lg">
                {verse.text}
              </p>
              <p className="text-peaceful-500 dark:text-gold-400 font-medium text-sm">
                {verse.reference}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Message */}
      <Card className="bg-gradient-to-br from-cream-100 to-cream-200 dark:from-deep-800 dark:to-deep-900 rounded-2xl border border-cream-300 dark:border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="text-gold-400 text-lg mt-1 flex-shrink-0">❤️</div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-2">
                A gentle reminder
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {verse.personalMessage}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={onShare}
          className="flex-1 bg-peaceful-400 hover:bg-peaceful-500 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex-1 bg-gold-400 hover:bg-gold-500 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          New Verse
        </Button>
      </div>
    </motion.div>
  );
}
