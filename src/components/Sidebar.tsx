
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Target, 
  Upload, 
  Settings, 
  Users, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "transactions", label: "Transações", icon: PlusCircle, badge: null },
    { id: "reports", label: "Relatórios", icon: BarChart3, badge: null },
    { id: "goals", label: "Metas", icon: Target, badge: null },
    { id: "import", label: "Importar", icon: Upload, badge: null },
    { id: "team", label: "Equipe", icon: Users, badge: "Pro" },
    { id: "settings", label: "Configurações", icon: Settings, badge: null },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">FinSimples</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-11 text-left ${
                isActive 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              } ${isCollapsed ? 'px-3' : 'px-4'}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "Pro" ? "secondary" : "default"} 
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Precisa de ajuda?</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Acesse nossos tutoriais e suporte
            </p>
            <Button size="sm" variant="outline" className="w-full text-xs">
              Central de Ajuda
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
