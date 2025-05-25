
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Users, 
  Upload, 
  Download,
  Database,
  Settings
} from 'lucide-react';

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Fragen', path: '/admin/questions' },
  { icon: Folder, label: 'Kategorien', path: '/admin/categories' },
  { icon: Users, label: 'Benutzer', path: '/admin/users' },
  { icon: Upload, label: 'Import', path: '/admin/import' },
  { icon: Download, label: 'Export', path: '/admin/export' },
  { icon: Database, label: 'Datenbank', path: '/admin/database' },
  { icon: Settings, label: 'Einstellungen', path: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-6">
        <div className="px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Icon size={16} className="mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
