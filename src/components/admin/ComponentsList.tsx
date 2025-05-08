
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ComponentsListProps {
  onSelectComponent: (componentId: string) => void;
  activeSection: string;
}

const ComponentsList = ({ onSelectComponent, activeSection }: ComponentsListProps) => {
  // List of live components on the landing page
  const landingPageComponents = [
    {
      id: "hero",
      name: "Hero",
      description: "Main headline and call to action"
    },
    {
      id: "achievements",
      name: "Achievements",
      description: "Counter stats section"
    },
    {
      id: "painPoints",
      name: "Pain Points",
      description: "Customer problems section"
    },
    {
      id: "faq",
      name: "FAQ",
      description: "Frequently asked questions"
    }
  ];

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

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
  };

  // Find active components based on current section
  const activeComponents = landingPageComponents.filter(
    component => component.id === activeSection
  );

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
          {(activeSection ? activeComponents : landingPageComponents).map((component) => (
            <button
              key={component.id}
              className="p-3 bg-gray-50 border rounded-md text-left hover:bg-gray-100 transition-colors"
              onClick={() => onSelectComponent(component.id)}
            >
              <div className="font-medium">{component.name}</div>
              <div className="text-xs text-gray-500">{component.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Add New Components</h3>
        
        {componentCategories.map((category) => (
          <div key={category.name} className="space-y-2 mb-6">
            <h4 className="text-xs text-gray-500">{category.name}</h4>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentsList;
