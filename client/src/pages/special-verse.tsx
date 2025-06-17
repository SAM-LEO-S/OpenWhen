import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SpecialVerse() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleBack = () => {
    setLocation("/");
  };

  const handleCallSupport = () => {
    // In a real app, this would initiate a phone call
    if (confirm("This will call the crisis support line. Continue?")) {
      window.location.href = "tel:988";
    }
  };

  const handleShareVerse = async () => {
    const text = `"Cast all your anxiety on him because he cares for you." - 1 Peter 5:7`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Bible Verse",
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Verse copied!",
          description: "The verse has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing verse:", error);
    }
  };

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

      {/* Special Message */}
      <div className="text-center space-y-4">
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-400 to-peaceful-400 rounded-full mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="text-white text-2xl" size={28} />
        </motion.div>
        <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-cream-50">
          You are never alone
        </h2>
      </div>

      {/* Verse Card */}
      <Card className="bg-white dark:bg-deep-900 rounded-2xl shadow-lg border border-cream-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="text-gold-400 text-lg mt-1 flex-shrink-0">❝</div>
            <div className="space-y-3">
              <p className="text-gray-800 dark:text-cream-50 leading-relaxed font-serif text-lg">
                Cast all your anxiety on him because he cares for you.
              </p>
              <p className="text-peaceful-500 dark:text-gold-400 font-medium text-sm">
                1 Peter 5:7
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card className="bg-gradient-to-br from-gold-50 to-peaceful-50 dark:from-gold-900/20 dark:to-peaceful-800/20 rounded-2xl border-2 border-gold-200 dark:border-gold-700/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="text-gold-400 text-xl" size={20} />
            <h3 className="font-semibold text-gray-800 dark:text-cream-50">
              Someone is always here
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            If you're in crisis or need someone to talk to, please reach out for help. 
            Your life has value and meaning.
          </p>
          <Card className="bg-white dark:bg-deep-800 rounded-xl border border-gold-200 dark:border-gold-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-cream-50">
                    Crisis Support
                  </p>
                  <p className="text-peaceful-500 dark:text-gold-400 font-mono text-lg">
                    988
                  </p>
                </div>
                <Button
                  onClick={handleCallSupport}
                  className="bg-gold-400 hover:bg-gold-500 text-white p-3 rounded-full transition-colors duration-200"
                  size="sm"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Encouraging Message */}
      <Card className="bg-gradient-to-br from-cream-100 to-cream-200 dark:from-deep-800 dark:to-deep-900 rounded-2xl border border-cream-300 dark:border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Heart className="text-gold-400 text-lg mt-1 flex-shrink-0" size={18} />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-2">
                You matter
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                Every emotion you feel is valid. God sees your struggles and walks with you 
                through every season of life. You are loved, you are valued, and you are never forgotten.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Button */}
      <Button
        onClick={handleShareVerse}
        className="w-full bg-peaceful-400 hover:bg-peaceful-500 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
      >
        Share This Verse
      </Button>
    </motion.div>
  );
}
