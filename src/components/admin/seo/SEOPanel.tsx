
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Globe, Bot, CheckCircle, AlertTriangle, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SEOPanelProps {
  landingPageId?: string;
  initialSEOData?: SEOData;
  onSave?: (data: SEOData) => void;
}

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  structuredData: string;
}

const defaultSEOData: SEOData = {
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
};

const SEOPanel = ({ landingPageId, initialSEOData, onSave }: SEOPanelProps) => {
  const { toast } = useToast();
  const [seoData, setSeoData] = useState<SEOData>(initialSEOData || defaultSEOData);
  const [seoScore, setSeoScore] = useState<number>(0);
  const [analyzingStatus, setAnalyzingStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [seoIssues, setSeoIssues] = useState<Array<{ type: 'error' | 'warning' | 'success', message: string }>>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSEO = () => {
    if (onSave) {
      onSave(seoData);
    }
    
    // Also save to localStorage for this demo
    const seoDataByPage = JSON.parse(localStorage.getItem('seoData') || '{}');
    seoDataByPage[landingPageId || 'default'] = seoData;
    localStorage.setItem('seoData', JSON.stringify(seoDataByPage));
    
    toast({
      title: "SEO Settings Saved",
      description: "Your SEO metadata has been updated successfully",
    });
  };

  const analyzeSEO = () => {
    setAnalyzingStatus('analyzing');
    
    // Simulate AI analysis
    setTimeout(() => {
      // Check for common SEO issues
      const issues = [];
      
      // Title analysis
      if (!seoData.title) {
        issues.push({ type: 'error' as const, message: 'Missing page title' });
      } else if (seoData.title.length < 30) {
        issues.push({ type: 'warning' as const, message: 'Title is too short (less than 30 characters)' });
      } else if (seoData.title.length > 60) {
        issues.push({ type: 'warning' as const, message: 'Title is too long (more than 60 characters)' });
      } else {
        issues.push({ type: 'success' as const, message: 'Title length is optimal' });
      }
      
      // Meta description analysis
      if (!seoData.description) {
        issues.push({ type: 'error' as const, message: 'Missing meta description' });
      } else if (seoData.description.length < 100) {
        issues.push({ type: 'warning' as const, message: 'Meta description is too short (less than 100 characters)' });
      } else if (seoData.description.length > 160) {
        issues.push({ type: 'warning' as const, message: 'Meta description is too long (more than 160 characters)' });
      } else {
        issues.push({ type: 'success' as const, message: 'Meta description length is optimal' });
      }
      
      // Keywords analysis
      if (!seoData.keywords) {
        issues.push({ type: 'error' as const, message: 'Missing keywords' });
      } else if (seoData.keywords.split(',').length < 3) {
        issues.push({ type: 'warning' as const, message: 'Too few keywords (less than 3)' });
      } else {
        issues.push({ type: 'success' as const, message: 'Keyword count is good' });
      }
      
      // Open Graph analysis
      if (!seoData.ogTitle || !seoData.ogDescription || !seoData.ogImage) {
        issues.push({ type: 'warning' as const, message: 'Missing Open Graph properties' });
      } else {
        issues.push({ type: 'success' as const, message: 'Open Graph tags are complete' });
      }
      
      // Structured data
      if (!seoData.structuredData) {
        issues.push({ type: 'warning' as const, message: 'Missing structured data' });
      } else {
        try {
          JSON.parse(seoData.structuredData);
          issues.push({ type: 'success' as const, message: 'Structured data is valid JSON' });
        } catch (e) {
          issues.push({ type: 'error' as const, message: 'Invalid JSON in structured data' });
        }
      }
      
      // Calculate score based on issues
      const errorCount = issues.filter(issue => issue.type === 'error').length;
      const warningCount = issues.filter(issue => issue.type === 'warning').length;
      const successCount = issues.filter(issue => issue.type === 'success').length;
      
      // Score calculation: 100 points minus deductions for errors and warnings
      const score = Math.max(0, Math.min(100, 100 - (errorCount * 20) - (warningCount * 10)));
      
      setSeoIssues(issues);
      setSeoScore(score);
      setAnalyzingStatus('complete');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SEO Settings</h2>
          <p className="text-gray-500">Optimize your landing page for search engines</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={analyzeSEO} disabled={analyzingStatus === 'analyzing'}>
            <Bot className="w-4 h-4 mr-2" />
            {analyzingStatus === 'analyzing' ? 'Analyzing...' : 'Analyze SEO'}
          </Button>
          <Button onClick={handleSaveSEO}>Save SEO Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>SEO Metadata</CardTitle>
              <CardDescription>Configure how your page appears in search engines</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic SEO</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title <span className="text-gray-500 text-sm">({seoData.title.length}/60)</span></Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={seoData.title} 
                        onChange={handleInputChange}
                        placeholder="Enter page title"
                        className={`${seoData.title.length > 60 ? 'border-yellow-500' : ''}`}
                      />
                      {seoData.title.length > 60 && (
                        <p className="text-yellow-500 text-sm">Title is too long and may be truncated in search results</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Meta Description <span className="text-gray-500 text-sm">({seoData.description.length}/160)</span></Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={seoData.description} 
                        onChange={handleInputChange}
                        placeholder="Enter meta description"
                        rows={3}
                        className={`${seoData.description.length > 160 ? 'border-yellow-500' : ''}`}
                      />
                      {seoData.description.length > 160 && (
                        <p className="text-yellow-500 text-sm">Description is too long and may be truncated in search results</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords <span className="text-gray-500 text-sm">(comma separated)</span></Label>
                      <Input 
                        id="keywords" 
                        name="keywords" 
                        value={seoData.keywords} 
                        onChange={handleInputChange}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input 
                        id="canonicalUrl" 
                        name="canonicalUrl" 
                        value={seoData.canonicalUrl} 
                        onChange={handleInputChange}
                        placeholder="https://yourdomain.com/page"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">Open Graph Title</Label>
                      <Input 
                        id="ogTitle" 
                        name="ogTitle" 
                        value={seoData.ogTitle} 
                        onChange={handleInputChange}
                        placeholder="Title for social sharing"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ogDescription">Open Graph Description</Label>
                      <Textarea 
                        id="ogDescription" 
                        name="ogDescription" 
                        value={seoData.ogDescription} 
                        onChange={handleInputChange}
                        placeholder="Description for social sharing"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ogImage">Open Graph Image URL</Label>
                      <Input 
                        id="ogImage" 
                        name="ogImage" 
                        value={seoData.ogImage} 
                        onChange={handleInputChange}
                        placeholder="https://yourdomain.com/image.jpg"
                      />
                      {seoData.ogImage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                          <div className="w-full max-w-xs h-32 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={seoData.ogImage.startsWith('http') ? seoData.ogImage : '/placeholder.svg'} 
                              alt="OG Preview" 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="structuredData">Structured Data (JSON-LD)</Label>
                      <Textarea 
                        id="structuredData" 
                        name="structuredData" 
                        value={seoData.structuredData} 
                        onChange={handleInputChange}
                        placeholder="Enter structured data in JSON format"
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Preview</CardTitle>
              <CardDescription>How your page may appear in search results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 space-y-1">
                <div className="text-blue-600 text-lg font-medium line-clamp-1">
                  {seoData.title || "Page Title"}
                </div>
                <div className="text-green-700 text-sm line-clamp-1">
                  {seoData.canonicalUrl || "https://yourdomain.com/page"}
                </div>
                <div className="text-sm line-clamp-2">
                  {seoData.description || "Meta description will appear here. Make sure to write a compelling description that encourages clicks."}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {analyzingStatus === 'complete' && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Analysis</CardTitle>
                <CardDescription>AI-powered SEO assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full border-8 border-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold">{seoScore}</span>
                  </div>
                  <p className="mt-2 text-sm">
                    {seoScore >= 80 ? 'Excellent' : 
                     seoScore >= 60 ? 'Good' : 
                     seoScore >= 40 ? 'Needs Improvement' : 'Poor'}
                  </p>
                </div>
                
                <Progress value={seoScore} className="h-2" />
                
                <div className="space-y-2 mt-4">
                  {seoIssues.map((issue, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {issue.type === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      )}
                      {issue.type === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                      )}
                      {issue.type === 'error' && (
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                      <span className={`text-sm ${
                        issue.type === 'success' ? 'text-green-700' : 
                        issue.type === 'warning' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {issue.message}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {analyzingStatus === 'analyzing' && (
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-t-primary border-gray-200 border-solid rounded-full animate-spin"></div>
                  <p>Analyzing SEO factors...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOPanel;
