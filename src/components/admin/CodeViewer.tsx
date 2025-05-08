
import React, { useState, useEffect } from 'react';
import { ComponentData } from './PageEditor';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Copy, CheckCheck } from 'lucide-react';

interface CodeViewerProps {
  sectionId: string;
  componentsData: ComponentData;
}

const CodeViewer = ({ sectionId, componentsData }: CodeViewerProps) => {
  const [originalCode, setOriginalCode] = useState<string>('');
  const [modifiedCode, setModifiedCode] = useState<string>('');
  const [selectedView, setSelectedView] = useState<'component' | 'data'>('component');
  const [copied, setCopied] = useState(false);

  // Fetch the component code based on the selected section
  useEffect(() => {
    // In a real application, this would fetch the actual component code
    // Here we're simulating it with template strings
    
    let code = '';
    let dataCode = '';
    
    switch (sectionId) {
      case 'hero':
        code = getHeroComponentCode();
        dataCode = JSON.stringify(componentsData.hero, null, 2);
        break;
      case 'achievements':
        code = getAchievementsComponentCode();
        dataCode = JSON.stringify(componentsData.achievements, null, 2);
        break;
      case 'painPoints':
        code = getPainPointsComponentCode();
        dataCode = JSON.stringify(componentsData.painPoints, null, 2);
        break;
      case 'faq':
        code = getFAQComponentCode();
        dataCode = JSON.stringify(componentsData.faq, null, 2);
        break;
      default:
        code = '// Select a component to view its code';
        dataCode = '// No data available';
    }

    setOriginalCode(code);
    setModifiedCode(code);
  }, [sectionId, componentsData]);

  const copyToClipboard = () => {
    const textToCopy = selectedView === 'component' ? modifiedCode : JSON.stringify(componentsData[sectionId as keyof ComponentData], null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHeroComponentCode = () => {
    return `import React from 'react';
import { ArrowRight } from "lucide-react";

interface HeroProps {
  customData?: {
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
}

const Hero = ({ customData }: HeroProps) => {
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Dubai's #1 Custom Signage";
  const subtitle = customData?.subtitle || "Get 40% More Foot Traffic or We'll Rebuild It Free!";
  const description = customData?.description || "Attention Retailers: Our Proven Designs Make Your Business Impossible to Miss";
  const ctaText = customData?.ctaText || "👉 GET MY FREE SIGNAGE PROPOSAL";
  const features = customData?.features || [
    "500+ UAE Businesses Trust Us",
    "24-Hour Rush Service",
    "Free Design Consultation"
  ];
  
  // Apply custom styling if provided
  const heroStyle = customData ? {
    backgroundColor: customData.backgroundColor || "transparent",
    color: customData.textColor || "inherit",
    backgroundImage: customData.backgroundImage ? \`url(\${customData.backgroundImage})\` : "none",
  } : {};

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-gray-100" 
      style={heroStyle}
    >
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {title}
                <span className="block text-highlight mt-2">
                  {subtitle}
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-700">
                {description}
                <span className="font-semibold">(See Case Studies Below)</span>
              </p>
            </div>
            
            <button className="cta-button w-full md:w-auto group" style={
              customData ? { 
                backgroundColor: customData.buttonColor, 
                color: customData.buttonTextColor 
              } : {}
            }>
              {ctaText}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-green-500 mr-2 text-xl">✔️</div>
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          
          {(!customData || (customData.showImage && customData.imageUrl)) && (
            <div className="relative">
              <div className="bg-white p-4 rounded-xl shadow-2xl overflow-hidden">
                <img 
                  src={customData?.imageUrl || "https://images.unsplash.com/photo-1586356986290-9eb801c282e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                  alt="Professional Signage" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-cta text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  PREMIUM QUALITY
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-highlight text-white p-4 rounded-lg shadow-lg transform rotate-6">
                <p className="font-bold">DUBAI QUALITY CERTIFIED</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;`;
  };

  const getAchievementsComponentCode = () => {
    return `import React, { useState, useEffect } from 'react';

interface AchievementsProps {
  customData?: {
    title: string;
    items: Array<{ number: string; label: string }>;
  };
}

const Achievements = ({ customData }: AchievementsProps) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Our Achievements";
  const achievementItems = customData?.items || [
    { number: "500+", label: "Completed Projects" },
    { number: "350+", label: "Satisfied Clients" },
    { number: "25+", label: "Industry Awards" }
  ];
  
  // Target counts for animation
  const targetCounts = {
    projects: parseInt(achievementItems[0]?.number) || 500,
    clients: parseInt(achievementItems[1]?.number) || 350,
    awards: parseInt(achievementItems[2]?.number) || 25
  };
  
  useEffect(() => {
    // Animate count up when component is in view
    const animateCount = (setter: React.Dispatch<React.SetStateAction<number>>, target: number) => {
      const duration = 2000; // 2 seconds
      const steps = 50;
      const stepTime = duration / steps;
      const stepValue = target / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        setter(Math.min(Math.round(stepValue * currentStep), target));
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepTime);
      
      return interval;
    };
    
    const count1Interval = animateCount(setCount1, targetCounts.projects);
    const count2Interval = animateCount(setCount2, targetCounts.clients);
    const count3Interval = animateCount(setCount3, targetCounts.awards);
    
    return () => {
      clearInterval(count1Interval);
      clearInterval(count2Interval);
      clearInterval(count3Interval);
    };
  }, [targetCounts]);

  return (
    <section className="py-12 bg-white border-t border-b border-gray-200">
      <div className="container">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievementItems.map((item, index) => (
            <div key={index} className="counter-box">
              <div className="text-center">
                <p className="text-4xl font-bold text-highlight">
                  {index === 0 ? count1 : index === 1 ? count2 : count3}+
                </p>
                <p className="text-gray-500 mt-1">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;`;
  };

  const getPainPointsComponentCode = () => {
    return `import React from 'react';

interface PainPointsProps {
  customData?: {
    title: string;
    problems: Array<{
      id: number;
      question: string;
      icon: string;
      description: string;
    }>;
  };
}

const PainPoints = ({ customData }: PainPointsProps) => {
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Is Your Business Suffering From These Signage Problems?";
  const problems = customData?.problems || [
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
  ];

  return (
    <section id="problems" className="py-16 md:py-24 bg-white">
      <div className="container">
        <h2 className="section-title">
          {title.split(" ").slice(0, -1).join(" ")}
          <span className="block text-highlight"> {title.split(" ").slice(-1)[0]}</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {problems.map((problem) => (
            <div key={problem.id} className="card-highlight group">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-highlight transition-colors">
                {problem.question}
              </h3>
              <p className="text-gray-600">
                {problem.description}
              </p>
              <div className="mt-6 flex">
                <input 
                  type="checkbox"
                  className="w-6 h-6 border-2 border-gray-300 rounded-md mr-3"
                />
                <label className="text-sm text-gray-500">I have this problem</label>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            Our Solutions Have Helped Clients Like You...
          </h3>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;`;
  };

  const getFAQComponentCode = () => {
    return `import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQProps {
  customData?: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const FAQ = ({ customData }: FAQProps) => {
  // Use custom data if provided, otherwise use defaults
  const title = customData?.title || "Frequently Asked Questions";
  const items = customData?.items || [
    { 
      question: "What if I hate the design?", 
      answer: "We'll redesign it free until you're thrilled!" 
    },
    {
      question: "How long does production take?",
      answer: "Standard production is 7-10 business days, but our rush service can deliver in as little as 24 hours!"
    },
    {
      question: "Do you help with installation?",
      answer: "Absolutely! Our professional installation team handles everything from permits to final placement."
    },
    {
      question: "What materials do you use?",
      answer: "We use only premium-grade materials that withstand Dubai's harsh climate, backed by our industry-leading warranty."
    },
    {
      question: "Can I see samples before ordering?",
      answer: "Yes! We provide physical material samples and detailed digital mockups before production begins."
    }
  ];
  
  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title mb-12 text-center">{title}</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={\`item-\${index}\`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-lg">Still have questions? Contact our team directly.</p>
            <button className="mt-4 px-8 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;`;
  };

  // Show diff between original and modified code (in a real app this would be more sophisticated)
  const renderDiffView = () => {
    // For this example, we're just showing the component code directly
    return (
      <div className="bg-gray-50 rounded-md p-4 font-mono text-sm overflow-auto h-[calc(100vh-300px)]">
        <pre className="whitespace-pre-wrap">{modifiedCode}</pre>
      </div>
    );
  };

  // Show the component data as JSON
  const renderDataView = () => {
    return (
      <div className="bg-gray-50 rounded-md p-4 font-mono text-sm overflow-auto h-[calc(100vh-300px)]">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(componentsData[sectionId as keyof ComponentData] || {}, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Component Code
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <CheckCheck className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs 
        value={selectedView} 
        onValueChange={(value) => setSelectedView(value as 'component' | 'data')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="component">Component Code</TabsTrigger>
          <TabsTrigger value="data">Component Data</TabsTrigger>
        </TabsList>
        <TabsContent value="component" className="mt-4">
          {renderDiffView()}
        </TabsContent>
        <TabsContent value="data" className="mt-4">
          {renderDataView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeViewer;
