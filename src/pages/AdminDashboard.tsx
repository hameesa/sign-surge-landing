
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
      ...data,
      seoData: seoData
    });
    localStorage.setItem('landingPages', JSON.stringify(savedPages));
    
    toast({
      title: "Landing Page Saved",
      description: "Your landing page has been saved successfully"
    });
    
    setActiveTab('editor');
  };
  
  const [seoData, setSeoData] = useState({
    title: "Dubai's #1 Custom Signage - IDesign Ads",
    description: "Get 40% More Foot Traffic with our Award-Winning Signage Solutions. Trusted by 500+ UAE Businesses. Free Design Consultation.",
    keywords: "signage dubai, custom signs, business signage, store signs, UAE signage company",
    ogTitle: "IDesign Ads - Dubai's Premier Signage Company",
    ogDescription: "Transform your business visibility with our custom signage solutions that drive foot traffic and increase sales. Serving the UAE since 2010.",
    ogImage: "/images/idesign-signage-sample.jpg",
    canonicalUrl: "https://idesignads.ae/",
    structuredData: `{
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "IDesign Ads",
      "description": "Custom signage solutions for businesses in Dubai and the UAE.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Business Bay",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "UAE"
      },
      "telephone": "+971 4 123 4567",
      "priceRange": "$$"
    }`
  });

  const handleSaveSEO = (data: any) => {
    setSeoData(data);
    toast({
      title: "SEO Settings Saved",
      description: "Your SEO metadata has been updated successfully"
    });
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
          <LandingPageBuilder
            onSaveLandingPage={handleSaveLandingPage}
            initialSEOData={seoData}
          />
        </TabsContent>
        
        <TabsContent value="brands">
          <BrandManager />
        </TabsContent>
        
        <TabsContent value="seo">
          <SEOPanel
            landingPageId="1" // TODO: dynamic landing page ID
            initialSEOData={seoData}
            onSave={handleSaveSEO}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
