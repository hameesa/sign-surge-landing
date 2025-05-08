
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ComponentEditor from './ComponentEditor';
import PreviewFrame from './PreviewFrame';
import ComponentsList from './ComponentsList';
import StylesEditor from './StylesEditor';
import CodeEditor from './CodeEditor';
import { Download, Eye, FileText, Save, Code, FileImage } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileUploader from './FileUploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define specific types for each component section
export type HeroData = {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  features: string[];
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  layout: string;
  alignment: string;
  padding: string;
  spacing: string;
  showImage: boolean;
  imagePosition: string;
  imageUrl: string;
  backgroundImage: string;
};

export type AchievementsData = {
  title: string;
  items: Array<{ number: string; label: string }>;
};

export type FAQData = {
  title: string;
  items: Array<{ question: string; answer: string }>;
};

export type PainPointsData = {
  title: string;
  problems: Array<{ id: number; question: string; icon: string; description: string }>;
};

export type FooterData = {
  copyright: string;
  quickLinks: Array<{label: string, url: string}>;
  socialLinks: Array<{label: string, url: string}>;
  contactInfo: {
    address: string;
    email: string;
    phone: string;
  };
};

// Define a shared type for component data that will be used across files
export type ComponentData = {
  hero: HeroData;
  achievements: AchievementsData;
  faq: FAQData;
  painPoints: PainPointsData;
  footer: FooterData;
};

interface PageEditorProps {
  initialComponentsData?: Partial<ComponentData>;
  onSave?: (data: ComponentData) => void;
}

const PageEditor = ({ initialComponentsData, onSave }: PageEditorProps) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Define the initial data structure for all editable components
  const [componentsData, setComponentsData] = useState<ComponentData>({
    hero: {
      title: "Dubai's #1 Custom Signage",
      subtitle: "Get 40% More Foot Traffic or We'll Rebuild It Free!",
      description: "Attention Retailers: Our Proven Designs Make Your Business Impossible to Miss",
      ctaText: "👉 GET MY FREE SIGNAGE PROPOSAL",
      features: [
        "500+ UAE Businesses Trust Us",
        "24-Hour Rush Service",
        "Free Design Consultation"
      ],
      backgroundImage: "",
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
      imageUrl: ""
    },
    achievements: {
      title: "Our Achievements",
      items: [
        { number: "500+", label: "Completed Projects" },
        { number: "350+", label: "Satisfied Clients" },
        { number: "25+", label: "Industry Awards" }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { question: "What if I hate the design?", answer: "We'll redesign it free until you're thrilled!" },
        { question: "How long does production take?", answer: "Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours!" }
      ]
    },
    painPoints: {
      title: "Is Your Business Suffering From These Signage Problems?",
      problems: [
        {
          id: 1,
          question: "Invisible storefronts losing customers?",
          icon: "🔍",
          description: "Studies show 68% of customers have skipped a business because they couldn't find or notice it."
        },
        {
          id: 2,
          question: "Faded signs making your brand look cheap?",
          icon: "🌦️",
          description: "Weather-damaged signage can reduce perceived business value by up to 47% according to consumer surveys."
        },
        {
          id: 3,
          question: "Event booths nobody notices?",
          icon: "📊",
          description: "The average trade show visitor walks past 87% of booths without stopping - yours doesn't have to be one of them."
        }
      ]
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} IDesign Ads. All rights reserved.`,
      quickLinks: [
        { label: "Services", url: "#" },
        { label: "Case Studies", url: "#testimonials" },
        { label: "FAQ", url: "#faq" },
        { label: "Contact", url: "#" }
      ],
      socialLinks: [
        { label: "Facebook", url: "#" },
        { label: "Instagram", url: "#" },
        { label: "LinkedIn", url: "#" }
      ],
      contactInfo: {
        address: "Business Bay, Dubai, UAE",
        email: "info@idesignads.ae",
        phone: "+971 4 123 4567"
      }
    }
  });

  // Load data from localStorage on initial load or use initialComponentsData if provided
  useEffect(() => {
    if (initialComponentsData) {
      // Merge with defaults
      const mergedData = { ...componentsData };
      
      Object.keys(initialComponentsData).forEach(key => {
        const typedKey = key as keyof ComponentData;
        if (initialComponentsData[typedKey]) {
          mergedData[typedKey] = {
            ...mergedData[typedKey],
            ...initialComponentsData[typedKey]
          };
        }
      });
      
      setComponentsData(mergedData);
    } else {
      const savedData = localStorage.getItem('landingPageData');
      if (savedData) {
        try {
          setComponentsData(JSON.parse(savedData));
        } catch (error) {
          console.error('Failed to parse saved data:', error);
        }
      }
    }
  }, [initialComponentsData]);

  // Simplified structure of sections that can be edited
  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'painPoints', name: 'Pain Points' },
    { id: 'caseStudies', name: 'Case Studies' },
    { id: 'offerStack', name: 'Offer Stack' },
    { id: 'comparisonTable', name: 'Comparison Table' },
    { id: 'urgencyCta', name: 'Urgency CTA' },
    { id: 'faq', name: 'FAQ Section' },
    { id: 'footer', name: 'Footer' }
  ];

  // Function to update component data
  const updateComponentData = (section: string, field: string, value: any) => {
    setComponentsData(prev => {
      if (!prev[section as keyof ComponentData]) return prev;
      
      const updatedData = {
        ...prev,
        [section]: {
          ...prev[section as keyof ComponentData],
          [field]: value
        }
      };
      
      // Auto-save changes as draft
      localStorage.setItem('landingPageData', JSON.stringify(updatedData));
      
      return updatedData;
    });
  };

  // Handle direct edit of element
  const handleDirectEdit = (sectionId: string, elementId: string, newValue: any) => {
    if (!componentsData[sectionId as keyof ComponentData]) return;
    
    // Update the direct edit value
    updateComponentData(sectionId, elementId, newValue);
    
    // Auto-focus this section
    setActiveSection(sectionId);
    setSelectedComponent(elementId);
    
    toast({
      title: "Element updated",
      description: `Changes to ${elementId} have been saved to your draft`,
    });
  };

  // Handle file upload for media
  const handleMediaUploaded = (fileUrl: string, fileName: string) => {
    if (activeSection === 'hero') {
      if (selectedComponent === 'imageUrl' || !selectedComponent) {
        updateComponentData('hero', 'imageUrl', fileUrl);
        setSelectedComponent('imageUrl');
        toast({
          title: "Image uploaded",
          description: `${fileName} has been set as the hero image`,
        });
      } else if (selectedComponent === 'backgroundImage') {
        updateComponentData('hero', 'backgroundImage', fileUrl);
        toast({
          title: "Background image uploaded",
          description: `${fileName} has been set as the background image`,
        });
      }
    }
    
    setShowMediaUploader(false);
  };

  // Handle publish functionality
  const handlePublish = () => {
    // Save the data to localStorage
    localStorage.setItem('landingPageData', JSON.stringify(componentsData));
    
    // Also save as published data which the front-end will use
    localStorage.setItem('publishedLandingPageData', JSON.stringify(componentsData));

    // Use BroadcastChannel API for better cross-tab communication
    const channel = new BroadcastChannel('landing_page_updates');
    channel.postMessage({ type: 'publish', data: componentsData });
    
    // Also dispatch storage event for backwards compatibility
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'publishedLandingPageData',
      newValue: JSON.stringify(componentsData)
    }));
    
    toast({
      title: "Changes published",
      description: "Your changes have been published to the live site",
    });

    // Call the onSave callback if provided
    if (onSave) {
      onSave(componentsData);
    }
  };

  // Handle save draft functionality
  const handleSaveDraft = () => {
    // Save the data to localStorage but don't update the published version
    localStorage.setItem('landingPageData', JSON.stringify(componentsData));
    
    toast({
      title: "Draft saved",
      description: "Your changes have been saved as a draft",
    });
  };

  // Export as HTML functionality
  const exportAsHTML = () => {
    // Generate HTML for the landing page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Landing Page Export</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, sans-serif; line-height: 1.5; color: #333; }
            img { max-width: 100%; height: auto; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            
            /* Component styles */
            .header { padding: 1rem 0; border-bottom: 1px solid #eee; }
            .logo { font-size: 1.5rem; font-weight: bold; }
            
            /* Hero section */
            .hero { 
              padding: 4rem 0; 
              background-color: ${componentsData.hero.backgroundColor}; 
              color: ${componentsData.hero.textColor};
              position: relative;
            }
            .hero-content {
              display: flex;
              flex-direction: ${componentsData.hero.layout === 'split' ? 'row' : 'column'};
              align-items: ${componentsData.hero.alignment === 'center' ? 'center' : 'flex-start'};
              gap: 2rem;
              text-align: ${componentsData.hero.alignment};
            }
            .hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
            .hero h2 { font-size: 1.8rem; margin-bottom: 1rem; }
            .hero-text, .hero-image {
              flex: ${componentsData.hero.layout === 'split' ? '1' : 'auto'};
            }
            .feature-list { 
              margin: 1.5rem 0; 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
            }
            .feature-item { display: flex; align-items: center; gap: 0.5rem; }
            .cta-button { 
              background-color: ${componentsData.hero.buttonColor}; 
              color: ${componentsData.hero.buttonTextColor}; 
              padding: 1rem 2rem; 
              border: none; 
              border-radius: 0.25rem;
              font-weight: bold;
              font-size: 1rem;
              cursor: pointer;
              display: inline-block;
              text-decoration: none;
              margin-top: 1.5rem;
            }
            
            /* Achievements section */
            .achievements { padding: 4rem 0; text-align: center; background-color: #f9f9f9; }
            .achievements h2 { font-size: 2rem; margin-bottom: 2rem; }
            .achievements-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 2rem; 
            }
            .achievement-item { padding: 1.5rem; }
            .achievement-number { font-size: 2.5rem; font-weight: bold; color: #4338ca; }
            
            /* Pain Points section */
            .pain-points { padding: 4rem 0; }
            .pain-points h2 { font-size: 2rem; margin-bottom: 2rem; text-align: center; }
            .problems-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem; 
            }
            .problem-item { 
              padding: 1.5rem; 
              border: 1px solid #eee;
              border-radius: 0.5rem;
            }
            .problem-icon { 
              font-size: 2rem; 
              background-color: #f5f5f5;
              width: 4rem;
              height: 4rem;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              margin-bottom: 1rem;
            }
            
            /* FAQ section */
            .faq { padding: 4rem 0; background-color: #f5f5f5; }
            .faq h2 { font-size: 2rem; margin-bottom: 2rem; }
            .faq-item { 
              margin-bottom: 1rem; 
              padding: 1.5rem;
              background-color: white;
              border-radius: 0.5rem;
            }
            .faq-question { font-weight: bold; margin-bottom: 0.5rem; }
            
            /* Footer */
            .footer { 
              padding: 4rem 0 2rem; 
              background-color: #1f2937; 
              color: #f9fafb;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 2rem;
            }
            .footer h3 { margin-bottom: 1.5rem; }
            .footer-links { list-style: none; }
            .footer-links li { margin-bottom: 0.5rem; }
            .footer-links a { color: #d1d5db; text-decoration: none; }
            .footer-links a:hover { color: white; }
            .footer-bottom { 
              margin-top: 3rem;
              padding-top: 1.5rem;
              border-top: 1px solid #374151;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .social-links { display: flex; gap: 1rem; margin-bottom: 1rem; }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
              .hero-content { flex-direction: column; text-align: center; }
              .footer-grid { grid-template-columns: 1fr; }
              .footer-bottom { flex-direction: column; text-align: center; }
            }
          </style>
        </head>
        <body>
          <header class="header">
            <div class="container">
              <div class="logo">IDesign</div>
            </div>
          </header>

          <main>
            <!-- Hero Section -->
            <section class="hero">
              <div class="container">
                <div class="hero-content">
                  <div class="hero-text">
                    <h1>${componentsData.hero.title}</h1>
                    <h2>${componentsData.hero.subtitle}</h2>
                    <p>${componentsData.hero.description}</p>
                    <div class="feature-list">
                      ${componentsData.hero.features.map(feature => 
                        `<div class="feature-item">✓ ${feature}</div>`
                      ).join('')}
                    </div>
                    <a href="#contact" class="cta-button">${componentsData.hero.ctaText}</a>
                  </div>
                  ${componentsData.hero.showImage && componentsData.hero.imageUrl ? 
                    `<div class="hero-image">
                      <img src="${componentsData.hero.imageUrl}" alt="Hero Image">
                    </div>` : ''
                  }
                </div>
              </div>
            </section>

            <!-- Achievements Section -->
            <section class="achievements">
              <div class="container">
                <h2>${componentsData.achievements.title}</h2>
                <div class="achievements-grid">
                  ${componentsData.achievements.items.map(item => 
                    `<div class="achievement-item">
                      <div class="achievement-number">${item.number}</div>
                      <div class="achievement-label">${item.label}</div>
                    </div>`
                  ).join('')}
                </div>
              </div>
            </section>

            <!-- Pain Points Section -->
            <section class="pain-points">
              <div class="container">
                <h2>${componentsData.painPoints.title}</h2>
                <div class="problems-grid">
                  ${componentsData.painPoints.problems.map(problem => 
                    `<div class="problem-item">
                      <div class="problem-icon">${problem.icon}</div>
                      <h3>${problem.question}</h3>
                      <p>${problem.description}</p>
                    </div>`
                  ).join('')}
                </div>
              </div>
            </section>

            <!-- FAQ Section -->
            <section class="faq">
              <div class="container">
                <h2>${componentsData.faq.title}</h2>
                <div class="faq-items">
                  ${componentsData.faq.items.map(item => 
                    `<div class="faq-item">
                      <div class="faq-question">${item.question}</div>
                      <div class="faq-answer">${item.answer}</div>
                    </div>`
                  ).join('')}
                </div>
              </div>
            </section>
          </main>

          <!-- Footer -->
          <footer class="footer">
            <div class="container">
              <div class="footer-grid">
                <div>
                  <h3>IDesign Ads</h3>
                  <p>The UAE's Most Awarded Signage Team, creating high-conversion signage solutions that drive business growth and maximize visibility.</p>
                  <div class="social-links">
                    ${componentsData.footer?.socialLinks.map(link => 
                      `<a href="${link.url}">${link.label}</a>`
                    ).join('')}
                  </div>
                </div>
                
                <div>
                  <h3>Quick Links</h3>
                  <ul class="footer-links">
                    ${componentsData.footer?.quickLinks.map(link => 
                      `<li><a href="${link.url}">${link.label}</a></li>`
                    ).join('')}
                  </ul>
                </div>
                
                <div>
                  <h3>Contact Us</h3>
                  <address>
                    <p>${componentsData.footer?.contactInfo.address}</p>
                    <p>Email: ${componentsData.footer?.contactInfo.email}</p>
                    <p>Phone: ${componentsData.footer?.contactInfo.phone}</p>
                  </address>
                </div>
              </div>
              
              <div class="footer-bottom">
                <p>${componentsData.footer?.copyright}</p>
              </div>
            </div>
          </footer>
        </body>
      </html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page-export.html';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "HTML Export Complete",
      description: "Your landing page has been exported as HTML",
    });
  };

  // Export as ZIP functionality
  const exportAsZip = () => {
    // In a real implementation, we would bundle all assets and HTML into a ZIP file
    toast({
      title: "ZIP Export",
      description: "Preparing ZIP export... This feature will be available soon.",
    });
  };

  // Export as PDF functionality
  const exportAsPDF = () => {
    toast({
      title: "PDF Export",
      description: "Preparing PDF export... This feature will be available soon.",
    });
  };

  // Handle drag-and-drop functionality
  const handleDrop = (e: React.DragEvent, targetSection: string) => {
    e.preventDefault();
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('component'));
      
      toast({
        title: "Component Added",
        description: `${componentData.name} added to ${targetSection}`,
      });
      
      // Here we would actually add the component to the section
      console.log('Added component', componentData, 'to section', targetSection);
    } catch (error) {
      console.error('Failed to parse dragged component data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleViewSite = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Page Sections</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-1" /> Save Draft
            </Button>
            
            <DropdownMenu open={showExportOptions} onOpenChange={setShowExportOptions}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportAsHTML}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsZip}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as ZIP
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={handleViewSite}>
              <Eye className="w-4 h-4 mr-1" /> Preview
            </Button>
            
            <Dialog open={showMediaUploader} onOpenChange={setShowMediaUploader}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileImage className="w-4 h-4 mr-1" /> Media
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload or Replace Media</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <FileUploader onFileUploaded={handleMediaUploaded} />
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={handlePublish}>
              Publish Changes
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id)}
              onDrop={(e) => handleDrop(e, section.id)}
              onDragOver={handleDragOver}
              className="relative"
            >
              {section.name}
              {activeSection === section.id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        <div className="w-1/3 bg-white rounded-lg shadow">
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="p-4">
              <ComponentsList 
                onSelectComponent={setSelectedComponent} 
                activeSection={activeSection}
              />
            </TabsContent>
            <TabsContent value="properties" className="p-4">
              <ComponentEditor 
                sectionId={activeSection} 
                selectedComponent={selectedComponent}
                componentsData={componentsData}
                updateComponentData={updateComponentData}
              />
            </TabsContent>
            <TabsContent value="styles" className="p-4">
              <StylesEditor 
                sectionId={activeSection} 
                componentsData={componentsData}
                updateComponentData={updateComponentData}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-2/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Preview</h2>
              <div className="flex gap-2">
                <div className="flex border rounded overflow-hidden">
                  <button 
                    className={`px-3 py-1 text-sm ${previewMode === 'mobile' ? 'bg-primary text-white' : 'bg-transparent'}`}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    Mobile
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm ${previewMode === 'tablet' ? 'bg-primary text-white' : 'bg-transparent'}`}
                    onClick={() => setPreviewMode('tablet')}
                  >
                    Tablet
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm ${previewMode === 'desktop' ? 'bg-primary text-white' : 'bg-transparent'}`}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    Desktop
                  </button>
                </div>
                <Button 
                  variant={editMode === 'visual' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditMode('visual')}
                >
                  Visual Editor
                </Button>
                <Button 
                  variant={editMode === 'code' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditMode('code')}
                >
                  Code Editor
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {editMode === 'code' ? (
              <CodeEditor
                sectionId={activeSection}
                componentsData={componentsData}
                updateComponentData={updateComponentData}
              />
            ) : (
              <PreviewFrame 
                sectionId={activeSection} 
                componentsData={componentsData}
                onDirectEdit={handleDirectEdit}
                editMode={true}
                previewMode={previewMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
