
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const publicNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Karteikarten', href: '/karteikarten' },
];

const authNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Fortschritt', href: '/fortschritt' },
  { label: 'Einstellungen', href: '/einstellungen' },
];

export function AppNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = user ? [...publicNavItems, ...authNavItems] : publicNavItems;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "py-4 px-2 border-b-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "border-[#3F00FF] text-[#3F00FF]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
