
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Settings, Eye, Save, Code } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CodeViewer from './CodeViewer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'preview'>('dashboard');
  
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
          <Tabs 
            defaultValue="dashboard" 
            className="w-full" 
            orientation="vertical"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'dashboard' | 'settings' | 'preview')}
          >
            <TabsList className="bg-transparent flex flex-col h-auto space-y-1">
              <TabsTrigger 
                value="dashboard" 
                className={`justify-start px-3 py-2 ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                onClick={() => navigate('/admin/dashboard')}
              >
                <LayoutDashboard className={`mr-2 ${!isSidebarOpen ? 'mr-0' : ''}`} size={20} />
                {isSidebarOpen && <span>Dashboard</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className={`justify-start px-3 py-2 ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Settings className={`mr-2 ${!isSidebarOpen ? 'mr-0' : ''}`} size={20} />
                {isSidebarOpen && <span>Settings</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className={`justify-start px-3 py-2 ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Eye className={`mr-2 ${!isSidebarOpen ? 'mr-0' : ''}`} size={20} />
                {isSidebarOpen && <span>Preview Site</span>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Code className="mr-2" size={16} />
                  Developer Tools
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[600px] sm:w-[800px]">
                <div className="h-full pt-6">
                  <h2 className="text-lg font-medium mb-4">Developer Tools</h2>
                  <div className="h-[calc(100vh-100px)] overflow-auto">
                    <CodeViewer sectionId="hero" componentsData={{
                      hero: {
                        title: "Example Title",
                        subtitle: "Example Subtitle",
                        description: "Example Description",
                        ctaText: "Example CTA",
                        features: [],
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        buttonColor: "#4338ca",
                        buttonTextColor: "#ffffff",
                        layout: "centered",
                        alignment: "left",
                        padding: "medium",
                        spacing: "medium",
                        showImage: true,
                        imagePosition: "right",
                        imageUrl: "",
                        backgroundImage: "",
                      },
                      achievements: { title: "", items: [] },
                      faq: { title: "", items: [] },
                      painPoints: { title: "", problems: [] }
                    }} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

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
