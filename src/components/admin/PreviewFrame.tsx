
import React, { useState, useEffect } from 'react';
import { ComponentData } from './PageEditor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from 'lucide-react';

interface PreviewFrameProps {
  sectionId: string;
  componentsData: ComponentData;
  onDirectEdit?: (sectionId: string, elementId: string, newValue: any) => void;
  editMode?: boolean;
  previewMode?: 'mobile' | 'tablet' | 'desktop';
}

const PreviewFrame = ({ 
  sectionId, 
  componentsData, 
  onDirectEdit, 
  editMode = false, 
  previewMode = 'desktop' 
}: PreviewFrameProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeEditElement, setActiveEditElement] = useState<{ id: string; value: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Simulate loading preview
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [sectionId]);
  
  // Reset active edit element when section changes
  useEffect(() => {
    setActiveEditElement(null);
  }, [sectionId]);

  // Get the appropriate container class based on the preview size
  const getPreviewContainerClass = () => {
    switch (previewMode) {
      case 'desktop':
        return 'w-full';
      case 'tablet':
        return 'w-[768px] mx-auto border';
      case 'mobile':
        return 'w-[375px] mx-auto border';
      default:
        return 'w-full';
    }
  };

  // This function starts the editing process for an element
  const startEdit = (id: string, value: string) => {
    if (!editMode || !onDirectEdit) return;
    
    setActiveEditElement({ id, value });
    setEditValue(value);
  };

  // This function saves the edited value
  const saveEdit = () => {
    if (!activeEditElement || !onDirectEdit) return;
    
    onDirectEdit(sectionId, activeEditElement.id, editValue);
    setActiveEditElement(null);
  };

  // This function cancels the edit
  const cancelEdit = () => {
    setActiveEditElement(null);
  };

  // This function creates an editable element
  const createEditableElement = (id: string, value: string, type: 'text' | 'heading', className?: string) => {
    if (activeEditElement?.id === id) {
      return (
        <div className="flex items-center gap-2 border border-blue-400 p-1 bg-blue-50 rounded">
          <Input 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)} 
            autoFocus
            className="flex-1"
          />
          <Button size="sm" variant="ghost" onClick={saveEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    const Element = type === 'heading' ? 'h2' : 'p';
    
    return (
      <div className="relative group">
        <Element className={className}>
          {value}
        </Element>
        {editMode && onDirectEdit && (
          <button 
            onClick={() => startEdit(id, value)} 
            className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  // This function generates the preview for each section type
  const getSectionPreview = () => {
    if (!componentsData[sectionId as keyof ComponentData]) {
      return (
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Select a section to preview</p>
        </div>
      );
    }
    
    switch (sectionId) {
      case 'hero': {
        const heroSection = componentsData.hero;
        
        const sectionStyle = {
          backgroundColor: heroSection.backgroundColor,
          color: heroSection.textColor,
          padding: heroSection.padding === 'small' ? '1rem' : heroSection.padding === 'medium' ? '2rem' : '4rem',
          backgroundImage: heroSection.backgroundImage ? `url(${heroSection.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
        
        const contentStyle = {
          textAlign: heroSection.alignment as 'left' | 'center' | 'right',
          display: 'flex',
          flexDirection: heroSection.layout === 'split' ? 'row' : 'column',
          gap: heroSection.spacing === 'small' ? '0.5rem' : heroSection.spacing === 'medium' ? '1rem' : '2rem'
        };
        
        const buttonStyle = {
          backgroundColor: heroSection.buttonColor,
          color: heroSection.buttonTextColor,
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          fontWeight: 'bold',
          display: 'inline-block',
          marginTop: '1rem'
        };
        
        return (
          <div style={sectionStyle} className="rounded-lg overflow-hidden">
            <div className="max-w-4xl mx-auto" style={contentStyle as React.CSSProperties}>
              {heroSection.showImage && heroSection.imageUrl && heroSection.imagePosition === 'left' && (
                <div className="flex-1 relative group">
                  <img src={heroSection.imageUrl} alt="Hero" className="w-full h-auto rounded-lg" />
                  {editMode && onDirectEdit && (
                    <button 
                      onClick={() => startEdit('imageUrl', heroSection.imageUrl)} 
                      className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
              
              <div className={`${heroSection.showImage && heroSection.imageUrl ? 'flex-1' : 'w-full'}`}>
                {createEditableElement('title', heroSection.title, 'heading', 'text-3xl font-bold mb-2')}
                {createEditableElement('subtitle', heroSection.subtitle, 'heading', 'text-xl font-bold mb-3')}
                {createEditableElement('description', heroSection.description, 'text', 'mb-4')}
                
                {heroSection.features && heroSection.features.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {heroSection.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 relative group">
                        <span className="text-primary">✓</span> {feature}
                        {editMode && onDirectEdit && (
                          <button 
                            onClick={() => startEdit(`features[${index}]`, feature)} 
                            className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                
                {activeEditElement?.id === 'ctaText' ? (
                  <div className="mt-4 flex items-center gap-2 border border-blue-400 p-1 bg-blue-50 rounded">
                    <Input 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                      autoFocus
                      className="flex-1"
                    />
                    <Button size="sm" variant="ghost" onClick={saveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative group">
                    <button style={buttonStyle}>{heroSection.ctaText}</button>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit('ctaText', heroSection.ctaText)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {heroSection.showImage && heroSection.imageUrl && heroSection.imagePosition === 'right' && (
                <div className="flex-1 relative group">
                  <img src={heroSection.imageUrl} alt="Hero" className="w-full h-auto rounded-lg" />
                  {editMode && onDirectEdit && (
                    <button 
                      onClick={() => startEdit('imageUrl', heroSection.imageUrl)} 
                      className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }
      
      case 'achievements': {
        const achievementsSection = componentsData.achievements;
        
        return (
          <div className="bg-white p-8 rounded-lg border">
            {createEditableElement('title', achievementsSection.title, 'heading', 'text-2xl font-bold mb-6 text-center')}
            
            <div className="grid grid-cols-3 gap-4">
              {achievementsSection.items.map((item, index) => (
                <div key={index} className="text-center relative group">
                  <div className="relative group">
                    <p className="text-2xl font-bold text-highlight">{item.number}</p>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit(`achievements.items[${index}].number`, item.number)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <p className="text-gray-500">{item.label}</p>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit(`achievements.items[${index}].label`, item.label)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      case 'faq': {
        const faqSection = componentsData.faq;
        
        return (
          <div className="bg-gray-50 p-8 rounded-lg">
            {createEditableElement('title', faqSection.title, 'heading', 'text-2xl font-bold mb-6')}
            
            <div className="space-y-4">
              {faqSection.items.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-lg">
                  <div className="relative group">
                    <h3 className="font-bold">{item.question}</h3>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit(`faq.items[${index}].question`, item.question)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <p className="text-gray-600">{item.answer}</p>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit(`faq.items[${index}].answer`, item.answer)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      case 'painPoints': {
        const painPointsSection = componentsData.painPoints;
        
        return (
          <div className="bg-white p-8 rounded-lg">
            {createEditableElement('title', painPointsSection.title, 'heading', 'text-2xl font-bold mb-6 text-center')}
            
            <div className="grid grid-cols-3 gap-4">
              {painPointsSection.problems.map((problem) => (
                <div key={problem.id} className="p-4 border rounded-lg">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">
                    {problem.icon}
                  </div>
                  
                  <div className="relative group">
                    <h3 className="text-lg font-bold mb-2">{problem.question}</h3>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit(`painPoints.problems[${problem.id-1}].question`, problem.question)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <p className="text-gray-600">{problem.description}</p>
                    {editMode && onDirectEdit && (
                      <button 
                        onClick={() => startEdit(`painPoints.problems[${problem.id-1}].description`, problem.description)} 
                        className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      case 'footer': {
        const footerSection = componentsData.footer;
        
        if (!footerSection) return null;
        
        return (
          <div className="bg-gray-900 text-gray-200 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">
                  <span className="text-highlight">I</span>Design Ads
                </h3>
                <p className="mb-4 text-gray-400">
                  The UAE's Most Awarded Signage Team, creating high-conversion signage solutions that drive business growth and maximize visibility.
                </p>
                <div className="flex space-x-4">
                  {footerSection.socialLinks.map((link, index) => (
                    <a key={index} href={link.url} className="hover:text-highlight transition-colors">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {footerSection.quickLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Contact Us</h4>
                <address className="text-gray-400 not-italic">
                  <p className="mb-2">{footerSection.contactInfo.address}</p>
                  <p className="mb-2">Email: {footerSection.contactInfo.email}</p>
                  <p className="mb-2">Phone: {footerSection.contactInfo.phone}</p>
                </address>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="relative group">
                <p className="text-sm text-gray-500">
                  {footerSection.copyright}
                </p>
                {editMode && onDirectEdit && (
                  <button 
                    onClick={() => startEdit('footer.copyright', footerSection.copyright)} 
                    className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        );
      }
      
      default:
        return (
          <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Preview not available for this section</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto border rounded-lg bg-gray-50 p-4">
        <div className={getPreviewContainerClass()}>
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-highlight border-gray-200 border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading preview...</p>
            </div>
          ) : (
            <div className="w-full">
              {getSectionPreview()}
              <div className="mt-4 text-center text-sm text-gray-500">
                <p className="flex items-center justify-center gap-1">
                  {editMode && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                      Click on any text element to edit it directly
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;
