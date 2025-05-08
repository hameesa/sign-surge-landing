import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ImageIcon, LayoutIcon, TypeIcon, PlusCircleIcon } from "lucide-react";
import FileUploader from './FileUploader';
import { useToast } from '@/hooks/use-toast';
import { ComponentData } from './PageEditor';

interface ComponentEditorProps {
  sectionId: string;
  selectedComponent: string;
  componentsData: ComponentData;
  updateComponentData: (section: string, field: string, value: any) => void;
}

const ComponentEditor = ({ sectionId, selectedComponent, componentsData, updateComponentData }: ComponentEditorProps) => {
  const { toast } = useToast();
  const [newFeature, setNewFeature] = useState("");
  const [selectedTab, setSelectedTab] = useState("content");
  
  // Use the actual component to edit based on selection or section
  const componentToEdit = selectedComponent || sectionId;
  
  // Get current section data
  const currentSection = componentsData[componentToEdit as keyof ComponentData];

  // Handle field changes
  const handleChange = (field: string, value: any) => {
    updateComponentData(componentToEdit, field, value);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    if (componentToEdit === 'hero' && componentsData.hero) {
      const updatedFeatures = [...componentsData.hero.features, newFeature.trim()];
      updateComponentData('hero', 'features', updatedFeatures);
      setNewFeature("");
      
      toast({
        title: "Feature added",
        description: "The new feature has been added to the list",
      });
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (componentToEdit === 'hero' && componentsData.hero) {
      const newFeatures = [...componentsData.hero.features];
      newFeatures.splice(index, 1);
      updateComponentData('hero', 'features', newFeatures);
      
      toast({
        title: "Feature removed",
        description: "The feature has been removed from the list",
      });
    }
  };

  const handleFileUploaded = (fileUrl: string, fileName: string) => {
    handleChange('imageUrl', fileUrl);
    
    toast({
      title: "Image updated",
      description: `${fileName} has been set as the section image`,
    });
  };

  // Handle adding a new FAQ item
  const handleAddFaqItem = () => {
    if (componentToEdit === 'faq' && componentsData.faq) {
      const updatedItems = [
        ...componentsData.faq.items,
        { question: "New Question", answer: "Add your answer here" }
      ];
      updateComponentData('faq', 'items', updatedItems);
    }
  };

  // Handle removing a FAQ item
  const handleRemoveFaqItem = (index: number) => {
    if (componentToEdit === 'faq' && componentsData.faq) {
      const updatedItems = [...componentsData.faq.items];
      updatedItems.splice(index, 1);
      updateComponentData('faq', 'items', updatedItems);
    }
  };

  // Handle updating a FAQ item
  const handleUpdateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    if (componentToEdit === 'faq' && componentsData.faq) {
      const updatedItems = [...componentsData.faq.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      updateComponentData('faq', 'items', updatedItems);
    }
  };

  // Handle adding achievement item
  const handleAddAchievement = () => {
    if (componentToEdit === 'achievements' && componentsData.achievements) {
      const updatedItems = [
        ...componentsData.achievements.items,
        { number: "0+", label: "New Achievement" }
      ];
      updateComponentData('achievements', 'items', updatedItems);
    }
  };

  // Handle removing achievement item
  const handleRemoveAchievement = (index: number) => {
    if (componentToEdit === 'achievements' && componentsData.achievements) {
      const updatedItems = [...componentsData.achievements.items];
      updatedItems.splice(index, 1);
      updateComponentData('achievements', 'items', updatedItems);
    }
  };

  // Handle updating achievement item
  const handleUpdateAchievement = (index: number, field: 'number' | 'label', value: string) => {
    if (componentToEdit === 'achievements' && componentsData.achievements) {
      const updatedItems = [...componentsData.achievements.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      updateComponentData('achievements', 'items', updatedItems);
    }
  };

  if (!currentSection) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a component or section to edit its properties
      </div>
    );
  }

  const renderComponentEditor = () => {
    if (!currentSection) {
      return (
        <div className="p-4 text-center text-gray-500">
          Select a component or section to edit its properties
        </div>
      );
    }

    const componentData = componentsData[componentToEdit as keyof ComponentData];

    if (!componentData) {
      return (
        <div className="p-4 text-center text-gray-500">
          Component data not found.
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-250px)] overflow-auto p-4">
        <div className="space-y-4">
          {Object.entries(componentData).map(([key, value]) => {
            if (typeof value === 'string') {
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    type="text"
                    id={key}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              );
            } else if (typeof value === 'number') {
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    type="number"
                    id={key}
                    value={value}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                  />
                </div>
              );
            } else if (typeof value === 'boolean') {
              return (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{key}</Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => handleChange(key, checked)}
                  />
                </div>
              );
            } else if (Array.isArray(value)) {
              return (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <div className="space-y-2">
                    {value.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newValue = [...componentData[key as keyof ComponentData] as any[]];
                            newValue[index] = e.target.value;
                            handleChange(key, newValue);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newValue = [...componentData[key as keyof ComponentData] as any[]];
                            newValue.splice(index, 1);
                            handleChange(key, newValue);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newValue = [...componentData[key as keyof ComponentData] as any[], ""];
                        handleChange(key, newValue);
                      }}
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
              );
            } else if (typeof value === 'object' && value !== null) {
              return (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <ComponentEditor
                    sectionId={key}
                    selectedComponent={key}
                    componentsData={{ [key]: value } as ComponentData}
                    updateComponentData={(childField: string, childValue: any) => {
                      handleChange(key, { ...value, [childField]: childValue });
                    }}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  };

  return currentSection ? renderComponentEditor() : (
    <div className="p-4 text-center text-gray-500">
      Select a component or section to edit its properties
    </div>
  );
};

export default ComponentEditor;
