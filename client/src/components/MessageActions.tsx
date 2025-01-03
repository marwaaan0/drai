import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Bookmark, Check } from 'lucide-react';

interface MessageActionsProps {
  content: string;
  messageId: string;
}

export function MessageActions({ content, messageId }: MessageActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <motion.div 
      className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        className={`p-1 rounded-md hover:bg-[#222] transition-colors ${
          isLiked ? 'text-red-500' : 'text-white/30'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLiked(!isLiked)}
      >
        <Heart size={12} />
      </motion.button>

      <motion.button
        className={`p-1 rounded-md hover:bg-[#222] transition-colors ${
          isSaved ? 'text-blue-500' : 'text-white/30'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSaved(!isSaved)}
      >
        <Bookmark size={12} />
      </motion.button>

      <motion.button
        className="p-1 rounded-md hover:bg-[#222] transition-colors text-white/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCopy}
      >
        <AnimatePresence mode="wait">
          {showCopied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={12} className="text-green-500" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Copy size={12} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
