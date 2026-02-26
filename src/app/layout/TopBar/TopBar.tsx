import { Search, User } from "lucide-react";
import type React from "react";
import { Input } from "../../../shared/components/Input/Input";
import { Button } from "../../../shared/components/Button/Button";

interface TopBarProps {
    username: string;
    role: string;
    profilePic?: string;
}

const TopBar: React.FC<TopBarProps> = (props) => {
    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl ml-0 lg:ml-0 mr-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
                type="text"
                placeholder="Buscar clientes, órdenes, productos..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" label={""} 
             />
        </div>
        {/* Mobile Search Icon */}
        <button className="sm:hidden p-2 rounded-lg hover:bg-gray-50">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        

        {/* User Profile */}
        <Button 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">{props.username}</p>
            <p className="text-xs text-gray-500">{props.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#4676B8] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </Button>
      </div>
    </header>
    )
}

export default TopBar;