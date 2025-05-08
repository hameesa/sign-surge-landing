import BottomNavigation from '@/components/admin/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import PageEditor from '@/components/admin/PageEditor';
import { useToast } from '@/hooks/use-toast';
import DashboardTabs from '@/components/admin/DashboardTabs';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="flex flex-col h-screen">
      <AdminLayout>
        <DashboardTabs
          initialSEOData={seoData}
          onSaveLandingPage={handleSaveLandingPage}
          onSaveSEO={handleSaveSEO}
        />
      </AdminLayout>
      <BottomNavigation />
    </div>
  );
};

export default AdminDashboard;
