
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ComponentData } from './PageEditor';

interface StylesEditorProps {
  sectionId: string;
  componentsData: ComponentData;
  updateComponentData: (section: string, field: string, value: any) => void;
}

const StylesEditor = ({ sectionId, componentsData, updateComponentData }: StylesEditorProps) => {
  const { toast } = useToast();
  const [elementType, setElementType] = useState('section');
  const [fontSize, setFontSize] = useState<number>(16);
  const [spacing, setSpacing] = useState<number>(16);
  const [colors, setColors] = useState({
    background: '#ffffff',
    text: '#000000',
    accent: '#4338ca',
    button: '#4338ca',
    buttonText: '#ffffff',
  });

  // Load current component data
  useEffect(() => {
    if (sectionId === 'hero' && componentsData.hero) {
      setColors({
        background: componentsData.hero.backgroundColor || '#ffffff',
        text: componentsData.hero.textColor || '#000000',
        accent: '#4338ca',
        button: componentsData.hero.buttonColor || '#4338ca',
        buttonText: componentsData.hero.buttonTextColor || '#ffffff',
      });
    }
  }, [sectionId, componentsData]);

  const handleColorChange = (property: string, value: string) => {
    setColors({
      ...colors,
      [property]: value
    });

    // Map color properties to component data properties
    const fieldMapping: Record<string, string> = {
      'background': 'backgroundColor',
      'text': 'textColor',
      'button': 'buttonColor',
      'buttonText': 'buttonTextColor'
    };

    if (sectionId === 'hero' && fieldMapping[property]) {
      updateComponentData('hero', fieldMapping[property], value);
      
      toast({
        title: "Style updated",
        description: `${property} color has been updated`,
      });
    }
  };

  const handleFontChange = (property: string, value: string) => {
    if (property === 'fontSize') {
      setFontSize(parseInt(value));
    }

    toast({
      title: "Font updated",
      description: `${property} has been updated`,
    });
  };

  const handleSpacingChange = (property: string, value: number[]) => {
    setSpacing(value[0]);

    // Map spacing properties to component data properties
    if (sectionId === 'hero') {
      const spaceValue = value[0] < 12 ? 'small' : value[0] < 24 ? 'medium' : 'large';
      
      if (property === 'padding') {
        updateComponentData('hero', 'padding', spaceValue);
      } else if (property === 'spacing') {
        updateComponentData('hero', 'spacing', spaceValue);
      }
      
      toast({
        title: "Spacing updated",
        description: `${property} has been updated to ${spaceValue}`,
      });
    }
  };

  const applyColorPalette = (palette: 'modern' | 'classic' | 'minimal' | 'bold') => {
    let newColors = { ...colors };
    
    switch (palette) {
      case 'modern':
        newColors = {
          background: '#F8F9FA',
          text: '#212529',
          accent: '#9B87F5',
          button: '#6366F1',
          buttonText: '#FFFFFF',
        };
        break;
      case 'classic':
        newColors = {
          background: '#FFFFFF',
          text: '#222222',
          accent: '#4F46E5',
          button: '#3730A3',
          buttonText: '#FFFFFF',
        };
        break;
      case 'minimal':
        newColors = {
          background: '#FFFFFF',
          text: '#374151',
          accent: '#6366F1',
          button: '#4F46E5',
          buttonText: '#FFFFFF',
        };
        break;
      case 'bold':
        newColors = {
          background: '#111827',
          text: '#F9FAFB',
          accent: '#8B5CF6',
          button: '#6D28D9',
          buttonText: '#FFFFFF',
        };
        break;
    }
    
    setColors(newColors);
    
    if (sectionId === 'hero') {
      updateComponentData('hero', 'backgroundColor', newColors.background);
      updateComponentData('hero', 'textColor', newColors.text);
      updateComponentData('hero', 'buttonColor', newColors.button);
      updateComponentData('hero', 'buttonTextColor', newColors.buttonText);
      
      toast({
        title: "Color palette applied",
        description: `${palette} theme has been applied`,
      });
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-250px)] overflow-auto">
      <div>
        <Label>Element Type</Label>
        <Select defaultValue={elementType} onValueChange={setElementType}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select element type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="section">Section</SelectItem>
            <SelectItem value="heading">Heading</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="button">Button</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Color Presets</h3>
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            className="h-12 bg-white hover:bg-gray-50 border-2"
            onClick={() => applyColorPalette('modern')}
          >
            <span className="flex flex-col items-center">
              <span className="w-full h-2 bg-[#9B87F5] rounded-t-sm"></span>
              <span className="text-xs mt-1">Modern</span>
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="h-12 bg-white hover:bg-gray-50 border-2"
            onClick={() => applyColorPalette('classic')}
          >
            <span className="flex flex-col items-center">
              <span className="w-full h-2 bg-[#4F46E5] rounded-t-sm"></span>
              <span className="text-xs mt-1">Classic</span>
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="h-12 bg-white hover:bg-gray-50 border-2"
            onClick={() => applyColorPalette('minimal')}
          >
            <span className="flex flex-col items-center">
              <span className="w-full h-2 bg-[#6366F1] rounded-t-sm"></span>
              <span className="text-xs mt-1">Minimal</span>
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="h-12 bg-[#111827] text-white hover:bg-gray-800 border-2"
            onClick={() => applyColorPalette('bold')}
          >
            <span className="flex flex-col items-center">
              <span className="w-full h-2 bg-[#8B5CF6] rounded-t-sm"></span>
              <span className="text-xs mt-1">Bold</span>
            </span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Colors</h3>
        
        <div className="space-y-2">
          <Label htmlFor="bgColor">Background Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              id="bgColor"
              value={colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input 
              type="text"
              value={colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              id="textColor"
              value={colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input 
              type="text"
              value={colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              id="accentColor"
              value={colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input 
              type="text"
              value={colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="buttonColor">Button Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              id="buttonColor"
              value={colors.button}
              onChange={(e) => handleColorChange('button', e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input 
              type="text"
              value={colors.button}
              onChange={(e) => handleColorChange('button', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="buttonTextColor">Button Text Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              id="buttonTextColor"
              value={colors.buttonText}
              onChange={(e) => handleColorChange('buttonText', e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input 
              type="text"
              value={colors.buttonText}
              onChange={(e) => handleColorChange('buttonText', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Typography</h3>
        
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select defaultValue="sans" onValueChange={(value) => handleFontChange('fontFamily', value)}>
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Heading Size</Label>
            <span className="text-sm text-gray-500">{fontSize}px</span>
          </div>
          <Slider 
            defaultValue={[fontSize]} 
            min={16} 
            max={72} 
            step={1}
            onValueChange={(value) => handleFontChange('fontSize', value[0].toString())}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Font Weight</Label>
          </div>
          <Select defaultValue="normal" onValueChange={(value) => handleFontChange('fontWeight', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Spacing</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Padding</Label>
            <span className="text-sm text-gray-500">{spacing}px</span>
          </div>
          <Slider 
            defaultValue={[spacing]} 
            min={0} 
            max={64} 
            step={4}
            onValueChange={(value) => handleSpacingChange('padding', value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Margin</Label>
            <span className="text-sm text-gray-500">24px</span>
          </div>
          <Slider 
            defaultValue={[24]} 
            min={0} 
            max={64} 
            step={4}
            onValueChange={(value) => handleSpacingChange('margin', value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Gap</Label>
            <span className="text-sm text-gray-500">12px</span>
          </div>
          <Slider 
            defaultValue={[12]} 
            min={0} 
            max={48} 
            step={4}
            onValueChange={(value) => handleSpacingChange('spacing', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StylesEditor;
