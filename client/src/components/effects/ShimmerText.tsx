import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ShimmerTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
}

export default function ShimmerText({ text, className = '', highlightWords = [] }: ShimmerTextProps) {
  const { isDarkMode } = useTheme();
  
  // Split text and determine which words to highlight
  const words = text.split(' ');
  
  return (
    <span className={cn('inline relative', className)}>
      {words.map((word, i) => {
        const shouldHighlight = highlightWords.includes(word) || 
                               (highlightWords.length === 0 && i === 1); // Default to second word if no highlights specified
        
        return (
          <span key={i} className="relative inline-block">
            <span className={cn(
              shouldHighlight ? 'relative z-10' : '', 
              i < words.length - 1 ? 'mr-2' : ''
            )}>
              {shouldHighlight ? (
                <span className={cn(
                  'relative inline-block',
                  'bg-clip-text text-transparent bg-gradient-to-r',
                  isDarkMode 
                    ? 'from-indigo-400 via-purple-500 to-indigo-400' 
                    : 'from-indigo-500 via-purple-600 to-indigo-500',
                  'bg-[length:200%_auto] animate-shimmer'
                )}>
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}