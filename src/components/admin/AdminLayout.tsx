
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Settings, Eye, Save, Code } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import CodeViewer from './CodeViewer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className={`font-bold text-primary transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <span className="text-highlight">I</span>Design Admin
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ArrowRight className={`transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/dashboard')}
              >
                <LayoutDashboard className="mr-2" size={20} />
                {isSidebarOpen && <span>Dashboard</span>}
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {}}
              >
                <Settings className="mr-2" size={20} />
                {isSidebarOpen && <span>Settings</span>}
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye className="mr-2" size={20} />
                {isSidebarOpen && <span>View Site</span>}
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleLogout}
          >
            {isSidebarOpen ? 'Logout' : 'Exit'}
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-semibold">Landing Page Editor</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.open('/', '_blank')}>
              <Eye className="mr-2" size={16} />
              View Live Site
            </Button>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
