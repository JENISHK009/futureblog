import { motion } from 'framer-motion';

interface FloatingShapesProps {
  className?: string;
}

export default function FloatingShapes({ className = '' }: FloatingShapesProps) {
  const shapes = [
    // Circle
    { 
      type: 'circle', 
      position: 'top-10 right-10', 
      size: 'w-16 h-16 md:w-20 md:h-20',
      delay: 0,
      duration: 6,
      opacity: 'opacity-5 dark:opacity-5'
    },
    // Square
    { 
      type: 'square', 
      position: 'top-1/4 left-10', 
      size: 'w-12 h-12 md:w-16 md:h-16',
      delay: 1.5,
      duration: 7, 
      opacity: 'opacity-5 dark:opacity-5'
    },
    // Triangle
    { 
      type: 'triangle', 
      position: 'bottom-20 right-20', 
      size: 'w-14 h-14 md:w-20 md:h-20',
      delay: 3,
      duration: 8,
      opacity: 'opacity-5 dark:opacity-5' 
    },
    // Donut
    { 
      type: 'donut', 
      position: 'bottom-40 left-1/3', 
      size: 'w-10 h-10 md:w-14 md:h-14',
      delay: 2,
      duration: 7.5,
      opacity: 'opacity-5 dark:opacity-5' 
    },
    // Plus
    { 
      type: 'plus', 
      position: 'top-1/3 right-1/4', 
      size: 'w-12 h-12 md:w-16 md:h-16',
      delay: 4,
      duration: 9,
      opacity: 'opacity-5 dark:opacity-5' 
    }
  ];

  // Calculate the shape component for each type
  const getShapeElement = (type: string) => {
    switch (type) {
      case 'circle':
        return <div className="rounded-full bg-primary w-full h-full" />;
      case 'square':
        return <div className="rounded-md bg-primary w-full h-full" />;
      case 'triangle':
        return (
          <div className="w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,15 100,100 0,100" className="fill-primary" />
            </svg>
          </div>
        );
      case 'donut':
        return (
          <div className="rounded-full border-4 border-primary w-full h-full" />
        );
      case 'plus':
        return (
          <div className="w-full h-full relative">
            <div className="absolute top-1/2 left-0 right-0 h-1/5 bg-primary transform -translate-y-1/2"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-1/5 bg-primary transform -translate-x-1/2"></div>
          </div>
        );
      default:
        return <div className="rounded-full bg-primary w-full h-full" />;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.position} ${shape.size} ${shape.opacity}`}
          initial={{ 
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1
          }}
          animate={{ 
            y: [0, -20, 20, -10, 0],
            x: [0, 15, -15, 10, 0],
            rotate: [0, 10, -10, 5, 0],
            scale: [1, 1.05, 0.95, 1.02, 1]
          }}
          transition={{ 
            repeat: Infinity,
            repeatType: "reverse",
            duration: shape.duration,
            delay: shape.delay,
            ease: "easeInOut" 
          }}
        >
          {getShapeElement(shape.type)}
        </motion.div>
      ))}
    </div>
  );
}