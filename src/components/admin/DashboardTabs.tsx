import React, { useState } from 'react';
import PageEditor from '@/components/admin/PageEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandManager from '@/components/admin/brand/BrandManager';
import LandingPageBuilder from '@/components/admin/landing/LandingPageBuilder';
import SEOPanel from '@/components/admin/seo/SEOPanel';

interface DashboardTabsProps {
  initialSEOData: any;
  onSaveLandingPage: (data: any) => void;
  onSaveSEO: (data: any) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ initialSEOData, onSaveLandingPage, onSaveSEO }) => {
  const [activeTab, setActiveTab] = useState('editor');

  return (
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
        <LandingPageBuilder
          onSaveLandingPage={onSaveLandingPage}
          initialSEOData={initialSEOData}
        />
      </TabsContent>
      
      <TabsContent value="brands">
        <BrandManager />
      </TabsContent>
      
      <TabsContent value="seo">
        <SEOPanel
          landingPageId="1" // TODO: dynamic landing page ID
          initialSEOData={initialSEOData}
          onSave={onSaveSEO}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;