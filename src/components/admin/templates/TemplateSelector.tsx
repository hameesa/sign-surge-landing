
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bot, Check, Bot as BotIcon } from "lucide-react";
import { landingPageTemplates } from './templateData';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string, templateData: any) => void;
  onGenerateAITemplate: () => void;
}

const TemplateSelector = ({ onSelectTemplate, onGenerateAITemplate }: TemplateSelectorProps) => {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = landingPageTemplates.find(t => t.id === templateId);
    
    if (template) {
      toast({
        title: "Template selected",
        description: `You've selected the ${template.name} template`,
      });
    }
  };
  
  const handleUseTemplate = () => {
    if (!selectedTemplateId) return;
    
    const template = landingPageTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      onSelectTemplate(selectedTemplateId, template.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Select a Template</h2>
        <Button variant="outline" onClick={onGenerateAITemplate}>
          <BotIcon className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {landingPageTemplates.map(template => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all ${
              selectedTemplateId === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {selectedTemplateId === template.id && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary">
                    <Check className="w-4 h-4 mr-1" /> Selected
                  </Badge>
                </div>
              )}
              {template.isAI && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Bot className="w-4 h-4" /> AI-Powered
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">{template.conversionRate}</p>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleSelectTemplate(template.id);
                }}
              >
                Preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          onClick={handleUseTemplate} 
          disabled={!selectedTemplateId}
        >
          Use Selected Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;
