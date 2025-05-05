
import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar/sidebar-base";
import { SidebarGroup } from "@/components/ui/sidebar/sidebar-group";
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu";
import { SidebarFooter } from "@/components/ui/sidebar/sidebar-footer";
import { Database, Gauge, Settings, BookOpenText, Award, BarChart, HelpCircle, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar: React.FC = () => {
  return (
    <Sidebar>
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Admin-Bereich</h2>
      </div>
      
      <SidebarMenu>
        <SidebarGroup title="Hauptnavigation">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <Gauge size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/questions" 
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <BookOpenText size={20} />
            <span>Fragenverwaltung</span>
          </NavLink>
          
          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <Tags size={20} />
            <span>Kategorieverwaltung</span>
          </NavLink>
          
          <NavLink 
            to="/admin/analytics" 
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <BarChart size={20} />
            <span>Statistiken</span>
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <Database size={20} />
            <span>Benutzerverwaltung</span>
          </NavLink>
          
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <Settings size={20} />
            <span>Einstellungen</span>
          </NavLink>
        </SidebarGroup>
      </SidebarMenu>
      
      <SidebarFooter>
        <div className="flex w-full flex-col gap-2">
          <NavLink 
            to="/admin/help"
            className={({ isActive }) => 
              cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                isActive ? "bg-accent font-medium" : "")
            }
          >
            <HelpCircle size={20} />
            <span>Hilfe</span>
          </NavLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
