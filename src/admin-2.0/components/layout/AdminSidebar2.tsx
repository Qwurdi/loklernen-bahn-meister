
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Settings,
  Database,
  Upload,
  Download
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin-2.0',
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: 'Fragen',
    href: '/admin-2.0/questions',
    icon: FileText
  },
  {
    title: 'Kategorien', 
    href: '/admin-2.0/categories',
    icon: FolderTree
  },
  {
    title: 'Import',
    href: '/admin-2.0/import',
    icon: Upload
  },
  {
    title: 'Export',
    href: '/admin-2.0/export', 
    icon: Download
  },
  {
    title: 'Datenbank',
    href: '/admin-2.0/database',
    icon: Database
  },
  {
    title: 'Einstellungen',
    href: '/admin-2.0/settings',
    icon: Settings
  }
];

export const AdminSidebar2: React.FC = () => {
  const location = useLocation();
  
  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin-2.0" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <span className="text-black font-semibold">Lok</span>
            <span className="text-[#3F00FF] font-semibold">Lernen</span>
            <div className="text-xs text-gray-500 mt-1">Admin Panel 2.0</div>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${active 
                      ? 'bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Admin Panel 2.0
          <br />
          Moderne Verwaltung
        </div>
      </div>
    </div>
  );
};
