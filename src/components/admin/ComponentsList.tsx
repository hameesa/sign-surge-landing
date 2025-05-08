
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ArrowRight, Trash, Plus, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ComponentsListProps {
  onSelectComponent: (componentId: string) => void;
  activeSection: string;
}

const ComponentsList = ({ onSelectComponent, activeSection }: ComponentsListProps) => {
  const { toast } = useToast();
  // List of live components on the landing page
  const [availableComponents, setAvailableComponents] = useState([
    {
      id: "hero",
      name: "Hero",
      description: "Main headline and call to action",
      subcomponents: [
        { id: "hero.title", name: "Title" },
        { id: "hero.subtitle", name: "Subtitle" },
        { id: "hero.cta", name: "CTA Button" },
        { id: "hero.image", name: "Hero Image" }
      ]
    },
    {
      id: "achievements",
      name: "Achievements",
      description: "Counter stats section",
      subcomponents: [
        { id: "achievements.title", name: "Title" },
        { id: "achievements.item1", name: "Stat Item 1" },
        { id: "achievements.item2", name: "Stat Item 2" },
        { id: "achievements.item3", name: "Stat Item 3" }
      ]
    },
    {
      id: "painPoints",
      name: "Pain Points",
      description: "Customer problems section",
      subcomponents: [
        { id: "painPoints.title", name: "Title" },
        { id: "painPoints.problem1", name: "Problem 1" },
        { id: "painPoints.problem2", name: "Problem 2" },
        { id: "painPoints.problem3", name: "Problem 3" }
      ]
    },
    {
      id: "faq",
      name: "FAQ",
      description: "Frequently asked questions",
      subcomponents: [
        { id: "faq.title", name: "Title" },
        { id: "faq.question1", name: "Question 1" },
        { id: "faq.question2", name: "Question 2" }
      ]
    }
  ]);

  // List of components that can be dragged onto the page
  const componentCategories = [
    {
      name: "Layout",
      components: [
        { id: "section", name: "Section" },
        { id: "container", name: "Container" },
        { id: "grid", name: "Grid" },
        { id: "column", name: "Column" }
      ]
    },
    {
      name: "Content",
      components: [
        { id: "heading", name: "Heading" },
        { id: "paragraph", name: "Paragraph" },
        { id: "button", name: "Button" },
        { id: "image", name: "Image" },
        { id: "icon", name: "Icon" }
      ]
    },
    {
      name: "Interactive",
      components: [
        { id: "form", name: "Form" },
        { id: "input", name: "Input" },
        { id: "accordion", name: "Accordion" },
        { id: "tabs", name: "Tabs" },
        { id: "timer", name: "Countdown Timer" }
      ]
    }
  ];

  // State for tracking which component items are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Actively used components based on the current section
  const [activeComponents, setActiveComponents] = useState<any[]>([]);

  // Update active components when the section changes
  useEffect(() => {
    const activeComp = availableComponents.find(comp => comp.id === activeSection);
    setActiveComponents(activeComp ? [activeComp] : []);
  }, [activeSection, availableComponents]);

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleComponentClick = (componentId: string) => {
    onSelectComponent(componentId);
  };

  const handleSubcomponentClick = (componentId: string) => {
    onSelectComponent(componentId);
  };

  const handleDuplicate = (e: React.MouseEvent, component: any) => {
    e.stopPropagation();
    toast({
      title: "Component duplicated",
      description: `A copy of ${component.name} has been created`,
    });
  };

  const handleDelete = (e: React.MouseEvent, component: any) => {
    e.stopPropagation();
    toast({
      title: "Coming soon",
      description: "Component deletion will be available in a future update",
    });
  };

  const handleAddNew = (category: string) => {
    toast({
      title: "Coming soon",
      description: `Adding new ${category} components will be available in a future update`,
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-250px)] overflow-auto">
      <div className="space-y-2 mb-6">
        <h3 className="text-sm font-medium text-gray-500">
          {activeSection !== '' ? 'Section Components' : 'Page Components'}
        </h3>
        
        {activeSection !== '' && (
          <div className="bg-gray-50 p-3 border rounded-md mb-4">
            <h4 className="text-sm font-medium mb-2">Active Section: {activeSection}</h4>
            <p className="text-xs text-gray-500">
              Select a component below to edit its properties
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-2">
          {activeComponents.map((component) => (
            <Accordion
              key={component.id}
              type="single"
              collapsible
              className="border rounded-md overflow-hidden"
              value={expandedItems[component.id] ? component.id : ""}
              onValueChange={(val) => setExpandedItems({...expandedItems, [component.id]: val === component.id})}
            >
              <AccordionItem value={component.id} className="border-none">
                <AccordionTrigger className="px-3 py-2 text-left hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div>
                      <div className="font-medium">{component.name}</div>
                      <div className="text-xs text-gray-500">{component.description}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                  <div className="p-2 space-y-1">
                    {component.subcomponents.map((subcomp: any) => (
                      <button
                        key={subcomp.id}
                        className="w-full p-2 text-left text-sm hover:bg-gray-50 rounded flex justify-between items-center"
                        onClick={() => handleSubcomponentClick(subcomp.id)}
                      >
                        <span>{subcomp.name}</span>
                        <ArrowRight size={14} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
          
          {/* If no active section is selected, show all components */}
          {!activeSection && availableComponents.map((component) => (
            <button
              key={component.id}
              className="p-3 bg-gray-50 border rounded-md text-left hover:bg-gray-100 transition-colors"
              onClick={() => handleComponentClick(component.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
            >
              <div className="font-medium">{component.name}</div>
              <div className="text-xs text-gray-500">{component.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Add New Components</h3>
        
        <Accordion type="single" collapsible>
          {componentCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name}>
              <AccordionTrigger className="text-sm">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
                  {category.components.map((component) => (
                    <div
                      key={component.id}
                      className="p-2 bg-gray-50 border rounded-md text-sm cursor-move hover:bg-gray-100 transition-colors flex items-center justify-center"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                    >
                      {component.name}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="border-dashed flex items-center justify-center gap-1" 
                    onClick={() => handleAddNew(category.name)}
                  >
                    <Plus size={14} /> Add New
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default ComponentsList;
