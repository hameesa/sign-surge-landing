import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import { useIsMobile } from '../../hooks/use-mobile';
import { Home, List, Settings } from 'lucide-react'; // Example icons, replace with your actual icons

const BottomNavigation = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 z-50">
      <div className="container mx-auto flex justify-around">
        <Link to="/admin" className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/admin/components" className="flex flex-col items-center">
          <List className="h-6 w-6" />
          <span className="text-xs">Components</span>
        </Link>
        <Link to="/admin/settings" className="flex flex-col items-center">
          <Settings className="h-6 w-6" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;