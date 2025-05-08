
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LandingPageReviewer from "./LandingPageReviewer";
import { Download, FileCode, Bot, Check, FileUp, CheckCircle, AlertTriangle, Plus, FileBadge, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateLandingPageTemplate } from "@/utils/ai";
import PageEditor from '@/components/admin/PageEditor';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import TemplateSelector from '../templates/TemplateSelector';
import { landingPageTemplates } from '../templates/templateData';
import ComponentsList from '../ComponentsList';
import SkeletonSelector from './SkeletonSelector';

interface LandingPageBuilderProps {
  onSaveLandingPage: (data: any) => void;
  initialData?: any;
  initialSEOData?: any;
}

type BuilderStep = 'template' | 'editor' | 'review' | 'publish';

const LandingPageBuilder = ({ onSaveLandingPage, initialData }: LandingPageBuilderProps) => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<BuilderStep>('template');
  const [templateData, setTemplateData] = useState<any>(initialData || null);
  const [pageTitle, setPageTitle] = useState(initialData?.title || 'New Landing Page');
  const [prompt, setPrompt] = useState<string>('');
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [reviewItems, setReviewItems] = useState<Array<{ name: string; status: 'passed' | 'warning' | 'error' }>>([]);
  
  useEffect(() => {
    // If initial data is provided, we can skip the template selection step
    if (initialData) {
      setActiveStep('editor');
    }
  }, [initialData]);

  // Simulate an AI review process
  const performAIReview = () => {
    toast({
      title: "AI Review Started",
      description: "Analyzing your landing page for conversion optimization...",
    });

    // In a real implementation, we would integrate with an AI service here
    setTimeout(() => {
      // Simulate review items
      const items = [
        { name: "Clear value proposition", status: 'passed' as const },
        { name: "Effective call-to-action", status: 'passed' as const },
        { name: "Mobile responsiveness", status: 'passed' as const },
        { name: "Loading speed", status: 'passed' as const },
        { name: "SEO optimization", status: 'warning' as const },
        { name: "Trust indicators", status: 'warning' as const },
        { name: "Visual hierarchy", status: 'passed' as const },
        { name: "Accessibility", status: 'error' as const },
        { name: "Customer testimonials", status: 'passed' as const },
      ];
      
      // Calculate score based on status
      const totalItems = items.length;
      const passedItems = items.filter(item => item.status === 'passed').length;
      const warningItems = items.filter(item => item.status === 'warning').length;
      
      // Formula: passed items are worth full points, warnings are worth half points
      const score = Math.round(((passedItems + (warningItems * 0.5)) / totalItems) * 100);
      
      setReviewScore(score);
      setReviewItems(items);
      
      toast({
        title: "AI Review Completed",
        description: `Your landing page scored ${score} out of 100`,
      });
    }, 2500);
  };

  const handleSelectTemplate = (templateId: string, data: any) => {
    setTemplateData(data);
    
    // Find the template name by ID
    const selectedTemplate = landingPageTemplates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setPageTitle(selectedTemplate.name);
    }
    
    setActiveStep('editor');
    toast({
      title: "Template Applied",
      description: "You can now customize your landing page",
    });
  };

  const handleGenerateFromPrompt = async () => {
    toast({
      title: "AI Template Generation",
      description: "Generating a custom template based on your business needs...",
    });

    try {
      const aiTemplate = await generateLandingPageTemplate(prompt);
      setTemplateData(aiTemplate);
      setPageTitle("AI-Generated Landing Page");
      setActiveStep('editor');
      toast({
        title: "AI Template Ready",
        description: "Your custom template has been generated!",
      });
    } catch (error) {
      console.error("Error generating AI template:", error);
      toast({
        title: "AI Template Generation Failed",
        description: "Failed to generate a custom template. Please try again.",
      });
    }
  };

  const handleSaveEditor = (data: any) => {
    setTemplateData({...data});
    toast({
      title: "Changes Saved",
      description: "Your landing page changes have been saved",
    });
  };

  const handleMoveToReview = () => {
    setActiveStep('review');
    performAIReview();
  };

  const handlePublishPage = () => {
    onSaveLandingPage({
      title: pageTitle,
      ...templateData
    });
    
    setActiveStep('publish');
    toast({
      title: "Landing Page Published",
      description: "Your landing page is now live!",
    });
  };

  const handleImportHTML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const htmlContent = event.target?.result as string;
        
        toast({
          title: "HTML Imported",
          description: "Converting your HTML to a compatible format...",
        });
        
        // Parse the HTML content
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlContent, 'text/html');

        // Extract the title
        const title = htmlDoc.querySelector('title')?.textContent || 'Imported HTML Page';
        setPageTitle(title);

        // Extract the body content
        const bodyContent = htmlDoc.querySelector('body')?.innerHTML || '<p>No content found</p>';

        // Create a simple template data object
        const importedTemplateData = {
          hero: {
            title: title,
            subtitle: "Imported from HTML",
            description: bodyContent,
            ctaText: "Learn More",
            features: [],
            backgroundColor: "#ffffff",
            textColor: "#000000",
            buttonColor: "#000000",
            buttonTextColor: "#ffffff",
            layout: "split",
            alignment: "left",
            padding: "large",
            spacing: "medium",
            showImage: true,
            imagePosition: "right",
            imageUrl: "https://via.placeholder.com/600",
            backgroundImage: ""
          },
          achievements: {
            title: "Our Achievements",
            items: []
          },
          painPoints: {
            title: "Pain Points",
            problems: []
          },
          faq: {
            title: "FAQ",
            items: []
          },
          footer: {
            copyright: "Imported HTML Page",
            quickLinks: [],
            socialLinks: [],
            contactInfo: {
              address: "",
              email: "",
              phone: ""
            }
          }
        };
        
        setTimeout(() => {
          setTemplateData(importedTemplateData);
          setActiveStep('editor');
          
          toast({
            title: "Conversion Complete",
            description: "Your HTML has been converted and imported",
          });
        }, 2000);
      };
      reader.readAsText(file);
    }
  };

  const handleHTMLExport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${pageTitle}</title>
      </head>
      <body>
        <h1>${pageTitle}</h1>
        <p>Landing Page Content</p>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageTitle}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePDFExport = () => {
    toast({
      title: "PDF Export",
      description: "PDF export is not yet implemented.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{pageTitle}</h2>
          <p className="text-gray-500">Build and optimize your high-converting landing page</p>
        </div>
        
        <div className="flex items-center gap-3">
          {activeStep !== 'template' && (
            <Button variant="outline" onClick={() => setActiveStep('template')}>
              Change Template
            </Button>
          )}
          
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept=".html" 
              className="hidden" 
              onChange={handleImportHTML}
            />
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2">
              <FileUp className="w-4 h-4 mr-2" />
              Import HTML
            </div>
          </label>
          
          {activeStep === 'editor' && (
            <Button onClick={handleMoveToReview}>
              Review Page
            </Button>
          )}
          
          {activeStep === 'review' && (
            <Button onClick={handlePublishPage}>
              Publish Page
            </Button>
          )}
        </div>
      </div>
      
      {/* Steps indicator */}
      <div className="flex items-center justify-between">
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            {['template', 'editor', 'review', 'publish'].map((step, index) => (
              <div key={step} className="flex flex-col items-center w-1/4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === activeStep ? 'bg-primary text-white font-bold' : 
                  ['template', 'editor', 'review', 'publish'].indexOf(step) < 
                  ['template', 'editor', 'review', 'publish'].indexOf(activeStep) ? 
                  'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`mt-2 text-sm ${step === activeStep ? 'text-primary font-medium' : 'text-gray-500'}`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ 
                width: activeStep === 'template' ? '25%' : 
                       activeStep === 'editor' ? '50%' : 
                       activeStep === 'review' ? '75%' : '100%' 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Template selection step */}
      {/* Single-line prompt input */}
      {activeStep === 'template' && (
        <div className="space-y-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Single-line Prompt
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="prompt"
              id="prompt"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter a single-line prompt to generate a landing page"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateFromPrompt}>Generate from Prompt</Button>
        </div>
      )}
      
      <TemplateSelector
        onSelectTemplate={handleSelectTemplate}
      />
      {activeStep === 'template' && (
        <SkeletonSelector
          onSelectSkeleton={(skeleton) => {
            console.log('Selected skeleton:', skeleton);
            
            const initialData = skeleton.reduce((acc, section) => {
              acc[section] = {}; // Initialize each section with an empty object
              return acc;
            }, {});

            setTemplateData(initialData);
            setActiveStep('editor');
            
            toast({
              title: "Skeleton Selected",
              description: `You have selected a skeleton with structure: ${skeleton.join(', ')}`,
            });
          }}
        />
      )}
      {/* Editor step */}
      {activeStep === 'editor' && templateData && (
        <ErrorBoundary>
          <div className="flex">
            <div className="w-1/4">
              <ComponentsList onSelectComponent={(componentId: string) => {
                console.log(`Selected component: ${componentId}`);
                toast({
                  title: "Component Selected",
                  description: `You have selected ${componentId}`,
                });
              }} activeSection="" />
            </div>
          <div className="w-3/4">
            <PageEditor
              initialComponentsData={templateData}
              onSave={handleSaveEditor}
            />
          </div>
        </div>
        </ErrorBoundary>
      )}
      
      {/* Review step */}
      {activeStep === 'review' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardContent className="pt-6">
                {/* Preview component would go here */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Landing page preview</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-background border-8 border-primary/10 mb-4">
                      <span className="text-2xl font-bold">{reviewScore}</span>
                    </div>
                    <h3 className="text-lg font-medium">Conversion Score</h3>
                    <p className="text-sm text-gray-500">Based on AI analysis</p>
                  </div>
                  
                  <Progress value={reviewScore} className="h-2 mb-2" />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lg font-medium">AI Review Checklist</h3>
                  
                  <div className="space-y-2">
                    {reviewItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.status === 'passed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {item.status === 'warning' && (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                          {item.status === 'error' && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <span>{item.name}</span>
                        </div>
                        <span className={`text-sm ${
                          item.status === 'passed' ? 'text-green-500' : 
                          item.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {item.status === 'passed' ? 'Passed' : 
                           item.status === 'warning' ? 'Needs Improvement' : 'Failed'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // This would regenerate the AI review in a real implementation
                      performAIReview();
                    }}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Re-analyze Page
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AI Recommendations</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Improve SEO Optimization
                </h4>
                <p className="text-sm text-gray-700">Add more specific keywords to your heading and meta description. Consider including relevant industry terms that your audience would search for.</p>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Add More Trust Indicators
                </h4>
                <p className="text-sm text-gray-700">Consider adding client logos, security badges, or additional testimonials to increase credibility and user trust.</p>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Fix Accessibility Issues
                </h4>
                <p className="text-sm text-gray-700">Some elements lack proper contrast ratios, and there are missing alt texts on images. This may prevent users with disabilities from engaging with your content.</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setActiveStep('editor')}>
                Back to Editor
              </Button>
              <Button onClick={handlePublishPage}>
                Publish Landing Page
              </Button>
            </div>
          </div>
          <LandingPageReviewer content={""} />
        </div>
      )}
      
      {/* Publish step */}
      {activeStep === 'publish' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Your landing page is live!</h3>
                <p className="text-gray-600">Your landing page has been published and is now accessible to visitors.</p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" className="w-full">
                    <Globe className="w-4 h-4 mr-2" /> View Live Page
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <FileBadge className="w-4 h-4 mr-2" /> View Analytics
                  </Button>
                </div>

                <div className="pt-4 border-t mt-6">
                  <h4 className="font-medium mb-3">Export Options</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full" onClick={handleHTMLExport}>
                      <Download className="w-4 h-4 mr-2" /> HTML Export
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handlePDFExport}>
                      <Download className="w-4 h-4 mr-2" /> PDF Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={() => setActiveStep('editor')}>
              <Plus className="w-4 h-4 mr-2" /> Create Another Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageBuilder;
