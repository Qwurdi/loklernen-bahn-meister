
import React from 'react';
import '../../styles/animations.css';

interface EnhancedLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({ 
  message = "Lade Inhalte...", 
  size = 'md',
  className = ''
}) => {
  // Determine size classes
  const containerSize = {
    sm: 'min-h-[20vh]',
    md: 'min-h-[40vh]',
    lg: 'min-h-[60vh]'
  }[size];

  const cardSize = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48'
  }[size];

  const particleSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  // Create particles with different animation delays
  const particles = [
    { delay: '0s', top: '10%', left: '50%' },
    { delay: '0.5s', top: '30%', left: '70%' },
    { delay: '1s', top: '70%', left: '30%' },
    { delay: '1.5s', top: '50%', left: '90%' },
    { delay: '2s', top: '80%', left: '50%' }
  ];

  // Use brand colors from Tailwind config
  return (
    <div 
      className={`flex ${containerSize} w-full items-center justify-center ${className}`}
      role="status"
      aria-label={message}
    >
      <div className="relative flex flex-col items-center">
        {/* Main card with gradient and pulsating effect */}
        <div 
          className={`${cardSize} rounded-xl bg-gradient-ultramarine gradient-shift shadow-lg pulsate flex items-center justify-center relative overflow-hidden`}
        >
          {/* Inner circular progress */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full border-4 border-gray-100/20 border-t-loklernen-ultramarine border-r-transparent border-l-transparent spinner-rotate"></div>
          </div>
          
          {/* Logo or icon in the middle */}
          <div className="text-white font-bold text-2xl">
            LokLernen
          </div>
        </div>

        {/* Orbiting particles */}
        <div className="absolute inset-0">
          {particles.map((particle, index) => (
            <div 
              key={index}
              className={`${particleSize} rounded-full bg-loklernen-sapphire absolute orbit`}
              style={{
                animationDelay: particle.delay,
                top: particle.top,
                left: particle.left,
                animationDuration: `${5 + index}s`
              }}
            />
          ))}
        </div>

        {/* Loading message */}
        <div className="mt-6 text-center">
          <p className="text-white text-fade">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoadingSpinner;
