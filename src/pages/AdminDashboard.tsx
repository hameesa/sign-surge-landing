
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import PageEditor from '@/components/admin/PageEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandManager from '@/components/admin/brand/BrandManager';
import LandingPageBuilder from '@/components/admin/landing/LandingPageBuilder';
import SEOPanel from '@/components/admin/seo/SEOPanel';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('editor');

  useEffect(() => {
    // Check if user is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSaveLandingPage = (data: any) => {
    // In a real app, this would connect to a backend API
    const savedPages = JSON.parse(localStorage.getItem('landingPages') || '[]');
    savedPages.push({
      id: Date.now().toString(),
      title: data.title || 'New Landing Page',
      createdAt: new Date().toISOString(),
      ...data
    });
    localStorage.setItem('landingPages', JSON.stringify(savedPages));
    
    toast({
      title: "Landing Page Saved",
      description: "Your landing page has been saved successfully"
    });
    
    setActiveTab('editor');
  };

  return (
    <AdminLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Page Editor</TabsTrigger>
          <TabsTrigger value="builder">Landing Page Builder</TabsTrigger>
          <TabsTrigger value="brands">Brand Management</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <PageEditor />
        </TabsContent>
        
        <TabsContent value="builder">
          <LandingPageBuilder onSaveLandingPage={handleSaveLandingPage} />
        </TabsContent>
        
        <TabsContent value="brands">
          <BrandManager />
        </TabsContent>
        
        <TabsContent value="seo">
          <SEOPanel />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
