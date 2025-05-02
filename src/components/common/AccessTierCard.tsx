
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, LockIcon } from 'lucide-react';

interface AccessTierCardProps {
  title: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  isPrimary?: boolean;
  requiresLogin?: boolean;
  isPremium?: boolean;
}

export default function AccessTierCard({ 
  title, 
  features, 
  buttonLabel, 
  buttonLink, 
  isPrimary = false, 
  requiresLogin = false, 
  isPremium = false 
}: AccessTierCardProps) {
  return (
    <div className={`rounded-xl p-6 h-full flex flex-col ${
      isPrimary 
        ? 'bg-black text-white border-loklernen-ultramarine border-2' 
        : isPremium 
          ? 'bg-gray-900 text-white border border-amber-500' 
          : 'bg-gray-100 border border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {isPremium && <span className="bg-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold">PREMIUM</span>}
        {requiresLogin && !isPremium && <LockIcon className="h-4 w-4 text-loklernen-ultramarine" />}
      </div>
      
      <ul className="mb-6 space-y-2 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className={`h-4 w-4 mt-1 ${isPrimary || isPremium ? 'text-loklernen-ultramarine' : 'text-loklernen-ultramarine'}`} />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link to={buttonLink} className="mt-auto">
        <Button 
          className={`w-full ${
            isPrimary 
              ? 'bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/80' 
              : isPremium 
                ? 'bg-amber-500 text-black hover:bg-amber-600' 
                : ''
          }`}
          variant={isPrimary || isPremium ? "default" : "outline"}
        >
          {buttonLabel}
        </Button>
      </Link>
    </div>
  );
}
