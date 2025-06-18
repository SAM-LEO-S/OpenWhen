import { useParams, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerseCard } from "@/components/verse-card";
import { fetchVerseByEmotion, shareVerse } from "@/lib/bible-api";
import { LocalStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { EmotionCategory, Verse } from "@shared/schema";

const emotionConfig = {
  anxious: {
    title: "When you're anxious",
    icon: "☁️",
    gradient: "from-blue-400 to-blue-500"
  },
  happy: {
    title: "When you're happy",
    icon: "☀️",
    gradient: "from-yellow-400 to-yellow-500"
  },
  sad: {
    title: "When you're sad",
    icon: "💔",
    gradient: "from-indigo-400 to-indigo-500"
  },
  grateful: {
    title: "When you're grateful",
    icon: "🙏",
    gradient: "from-green-400 to-green-500"
  },
  strength: {
    title: "When you need strength",
    icon: "✊",
    gradient: "from-red-400 to-red-500"
  },
  lonely: {
    title: "When you're lonely",
    icon: "👤",
    gradient: "from-purple-400 to-purple-500"
  },
  guidance: {
    title: "When you need guidance",
    icon: "🧭",
    gradient: "from-teal-400 to-teal-500"
  },
  angry: {
    title: "When you're angry",
    icon: "🔥",
    gradient: "from-orange-400 to-orange-500"
  }
};

export default function Verse() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const emotion = params.emotion as EmotionCategory;
  
  const config = emotionConfig[emotion as keyof typeof emotionConfig];

  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);
  const [hasError, setHasError] = useState(false);

  // --- Load verse on component mount and emotion change ---
  useEffect(() => {
    if (!emotion || !config) {
      setHasError(true);
      setIsLoadingVerse(false);
      return;
    }

    const loadVerse = async () => {
      setIsLoadingVerse(true);
      setHasError(false);
      setCurrentVerse(null);

      try {
        // Always try to fetch a fresh verse first
        const freshVerse = await fetchVerseByEmotion(emotion);
        if (freshVerse) {
          LocalStorage.addCachedVerse(emotion, freshVerse);
          setCurrentVerse(freshVerse);
        } else {
          // If API returns null, try cached verse
          const cachedVerse = LocalStorage.getRandomCachedVerse(emotion);
          if (cachedVerse) {
            setCurrentVerse(cachedVerse);
            toast({
              title: "Cached verse",
              description: "Showing a previously saved verse.",
            });
          } else {
            setHasError(true);
          }
        }
      } catch (error) {
        console.error("Error loading verse:", error);
        // Try cached verse as fallback
        const cachedVerse = LocalStorage.getRandomCachedVerse(emotion);
        if (cachedVerse) {
          setCurrentVerse(cachedVerse);
          toast({
            title: "Offline verse",
            description: "Showing a previously saved verse due to connection issues.",
          });
        } else {
          setHasError(true);
        }
      } finally {
        setIsLoadingVerse(false);
      }
    };

    loadVerse();
  }, [emotion, config, toast]);

  const verse = currentVerse;
  const isLoading = isLoadingVerse;

  // --- useMutation for Refreshing Verse ---
  const refreshMutation = useMutation({
    mutationFn: () => fetchVerseByEmotion(emotion),
    onSuccess: (newVerse) => {
      if (newVerse) {
        LocalStorage.addCachedVerse(emotion, newVerse);
        setCurrentVerse(newVerse);
        setIsLoadingVerse(false);
        toast({
          title: "New verse loaded",
          description: "Here's another verse for you.",
        });
      } else {
        setIsLoadingVerse(false);
        toast({
          title: "Could not get a new verse",
          description: "The API did not return a valid verse.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Refresh mutation failed:", error);
      setIsLoadingVerse(false);
      // Try cached verse as fallback only if API failed
      const cachedVerse = LocalStorage.getRandomCachedVerse(emotion);
      if (cachedVerse) {
        setCurrentVerse(cachedVerse);
        toast({
          title: "Offline verse",
          description: "Showing a previously saved verse. Please check your connection.",
        });
      } else {
        toast({
          title: "Unable to load new verse",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleShare = async () => {
    if (verse) {
      try {
        await shareVerse(verse);
        toast({
          title: "Verse shared!",
          description: "The verse has been shared successfully.",
        });
      } catch (error) {
        toast({
          title: "Verse copied!",
          description: "The verse has been copied to your clipboard.",
        });
      }
    }
  };

  const handleRefresh = () => {
    // Clear current verse to show loading state
    setCurrentVerse(null);
    setIsLoadingVerse(true);
    // Force a fresh API call
    refreshMutation.mutate();
  };

  const handleBack = () => {
    setLocation("/");
  };

  const handleRetry = () => {
    // Reset states to trigger a fresh load
    setIsLoadingVerse(true);
    setHasError(false);
    setCurrentVerse(null);
  };

  // --- Render Logic ---
  if (!config) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Emotion</h1>
            <p className="text-sm text-gray-600 mb-4">
              The emotion category you're looking for doesn't exist.
            </p>
            <Button onClick={handleBack}>Go Back Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 animate-fade-in max-w-md mx-auto px-4 py-6"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="flex items-center space-x-2 text-peaceful-500 dark:text-gold-400 hover:text-peaceful-600 dark:hover:text-gold-300 transition-colors duration-200 p-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </Button>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 space-y-4">
          <motion.div 
            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gold-400 to-peaceful-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white text-lg">✟</span>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300">
            Finding the perfect verse for you...
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && hasError && !verse && (
        <div className="text-center py-12 space-y-4">
          <AlertTriangle className="text-red-400 text-3xl mx-auto" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-cream-50">
            Unable to load verse
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Please check your connection and try again.
          </p>
          <Button
            onClick={handleRetry}
            className="bg-peaceful-400 hover:bg-peaceful-500 text-white font-medium py-2 px-6 rounded-xl transition-colors duration-200"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Verse Content */}
      {verse && (
        <>
          {/* Emotion Header */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-full mb-4`}>
              <span className="text-white text-2xl">{config.icon}</span>
            </div>
            <h2 className="text-xl font-serif font-semibold text-gray-800 dark:text-cream-50">
              {config.title}
            </h2>
          </div>

          <VerseCard
            verse={verse}
            onShare={handleShare}
            onRefresh={handleRefresh}
            isLoading={refreshMutation.isPending}
          />
        </>
      )}
    </motion.div>
  );
}