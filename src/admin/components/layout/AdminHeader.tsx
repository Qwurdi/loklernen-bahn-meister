
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-black text-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">
            <span className="text-white">Lok</span>
            <span className="text-[#3F00FF]">Lernen</span>
            <span className="text-white ml-2">CMS</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User size={16} />
            <span className="text-sm">{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-white hover:bg-gray-800"
          >
            <LogOut size={16} className="mr-2" />
            Abmelden
          </Button>
        </div>
      </div>
    </header>
  );
};
