
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ComponentEditor from './ComponentEditor';
import PreviewFrame from './PreviewFrame';
import ComponentsList from './ComponentsList';
import StylesEditor from './StylesEditor';
import CodeEditor from './CodeEditor';
import { Download, Eye, FileText, Save } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define a shared type for component data that will be used across files
export type ComponentData = {
  hero: {
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
  achievements: {
    title: string;
    items: Array<{ number: string; label: string }>;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  painPoints: {
    title: string;
    problems: Array<{ id: number; question: string; icon: string; description: string }>;
  };
};

const PageEditor = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');
  
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
    }
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('landingPageData');
    if (savedData) {
      try {
        setComponentsData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, []);

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
  };

  const handleSaveDraft = () => {
    // Save the data to localStorage but don't update the published version
    localStorage.setItem('landingPageData', JSON.stringify(componentsData));
    
    toast({
      title: "Draft saved",
      description: "Your changes have been saved as a draft",
    });
  };

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
            body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .hero { padding: 2rem 0; }
            .hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
            .hero h2 { font-size: 1.8rem; margin-bottom: 1rem; }
            .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0; }
            .feature { display: flex; align-items: center; }
            .feature-icon { margin-right: 0.5rem; }
            .cta-button { 
              background-color: ${componentsData.hero.buttonColor}; 
              color: ${componentsData.hero.buttonTextColor}; 
              padding: 1rem 2rem; 
              border: none; 
              border-radius: 0.25rem;
              font-weight: bold;
              cursor: pointer;
            }
            .achievements { padding: 2rem 0; text-align: center; }
            .achievement-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
            .achievement-item { padding: 1rem; }
            .achievement-number { font-size: 2.5rem; font-weight: bold; color: #4338ca; }
            .faq-section { padding: 2rem 0; }
            .faq-item { margin-bottom: 1rem; }
            .faq-question { font-weight: bold; margin-bottom: 0.5rem; }
            .faq-answer { margin-left: 1rem; }
          </style>
        </head>
        <body>
          <header>
            <div class="container">
              <h2>iDesign</h2>
            </div>
          </header>

          <main>
            <section class="hero" style="background-color: ${componentsData.hero.backgroundColor}; color: ${componentsData.hero.textColor};">
              <div class="container">
                <h1>${componentsData.hero.title}</h1>
                <h2>${componentsData.hero.subtitle}</h2>
                <p>${componentsData.hero.description}</p>
                <div class="features">
                  ${componentsData.hero.features.map(feature => 
                    `<div class="feature"><span class="feature-icon">✓</span> ${feature}</div>`
                  ).join('')}
                </div>
                <button class="cta-button">${componentsData.hero.ctaText}</button>
              </div>
            </section>

            <section class="achievements">
              <div class="container">
                <h2>${componentsData.achievements.title}</h2>
                <div class="achievement-grid">
                  ${componentsData.achievements.items.map(item => 
                    `<div class="achievement-item">
                      <div class="achievement-number">${item.number}</div>
                      <div class="achievement-label">${item.label}</div>
                    </div>`
                  ).join('')}
                </div>
              </div>
            </section>

            <section class="faq-section">
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

          <footer>
            <div class="container">
              <p>&copy; ${new Date().getFullYear()} IDesign. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page-export.html';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "HTML Export Complete",
      description: "Your landing page has been exported as HTML",
    });
  };

  const exportAsPDF = () => {
    toast({
      title: "PDF Export",
      description: "Preparing PDF export... This feature will be available soon.",
    });
  };

  const handleDrop = (e: React.DragEvent, targetSection: string) => {
    e.preventDefault();
    const componentData = JSON.parse(e.dataTransfer.getData('component'));
    
    toast({
      title: "Component Added",
      description: `${componentData.name} added to ${targetSection}`,
    });
    
    // Here we would actually add the component to the section
    console.log('Added component', componentData, 'to section', targetSection);
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
                <DropdownMenuItem onClick={exportAsPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={handleViewSite}>
              <Eye className="w-4 h-4 mr-1" /> Preview
            </Button>
            
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
