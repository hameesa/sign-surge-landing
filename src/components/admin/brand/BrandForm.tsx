
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from '@/components/admin/FileUploader';
import { Brand } from '@/types/brand';

interface BrandFormProps {
  initialData?: Brand;
  onSubmit: (data: any) => void;
}

const BrandForm = ({ initialData, onSubmit }: BrandFormProps) => {
  const [formData, setFormData] = useState<any>(initialData || {
    name: '',
    description: '',
    logo: '',
    colors: {
      primary: '#4338ca',
      secondary: '#9b87f5', 
      accent: '#ea384c',
      background: '#ffffff',
      text: '#000000',
    },
    fonts: {
      heading: 'sans-serif',
      body: 'sans-serif',
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (colorType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleFontChange = (fontType: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value
      }
    }));
  };

  const handleLogoUploaded = (fileUrl: string) => {
    setFormData(prev => ({ ...prev, logo: fileUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Basic Info</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange}
              placeholder="Enter brand name" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Brand Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange}
              placeholder="Enter brand description" 
              rows={3} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Brand Logo</Label>
            {formData.logo && (
              <div className="mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden mb-2">
                  <img src={formData.logo} alt="Brand Logo" className="w-full h-full object-contain" />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                >
                  Remove Logo
                </Button>
              </div>
            )}
            {!formData.logo && (
              <FileUploader 
                onFileUploaded={(url) => handleLogoUploaded(url)}
                allowedTypes={["image/jpeg", "image/png", "image/svg+xml"]}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="primaryColor" 
                  value={formData.colors.primary} 
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input 
                  type="text" 
                  value={formData.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="secondaryColor" 
                  value={formData.colors.secondary} 
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input 
                  type="text" 
                  value={formData.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="accentColor" 
                  value={formData.colors.accent} 
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input 
                  type="text" 
                  value={formData.colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="backgroundColor" 
                  value={formData.colors.background} 
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input 
                  type="text" 
                  value={formData.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  id="textColor" 
                  value={formData.colors.text} 
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input 
                  type="text" 
                  value={formData.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Preview</h3>
            <div className="p-4 rounded-md" style={{ backgroundColor: formData.colors.background }}>
              <div className="mb-4">
                <h3 className="text-xl font-bold" style={{ color: formData.colors.primary }}>Primary Color Heading</h3>
                <p style={{ color: formData.colors.text }}>This is how your text will look with the selected colors.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1.5 rounded-md text-white" 
                  style={{ backgroundColor: formData.colors.primary }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-3 py-1.5 rounded-md text-white" 
                  style={{ backgroundColor: formData.colors.secondary }}
                >
                  Secondary Button
                </button>
                <button 
                  className="px-3 py-1.5 rounded-md text-white" 
                  style={{ backgroundColor: formData.colors.accent }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headingFont">Heading Font</Label>
            <select 
              id="headingFont"
              value={formData.fonts.heading}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
              <option value="'Playfair Display', serif">Playfair Display</option>
              <option value="'Roboto', sans-serif">Roboto</option>
            </select>
            
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-2">Preview:</h3>
              <div className="p-4 bg-gray-100 rounded-md">
                <h1 className="text-2xl mb-2" style={{ fontFamily: formData.fonts.heading }}>
                  This is a heading font preview
                </h1>
                <h2 className="text-xl" style={{ fontFamily: formData.fonts.heading }}>
                  This is a subheading preview
                </h2>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bodyFont">Body Font</Label>
            <select
              id="bodyFont"
              value={formData.fonts.body}
              onChange={(e) => handleFontChange('body', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Lora', serif">Lora</option>
              <option value="'Roboto', sans-serif">Roboto</option>
            </select>
            
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-2">Preview:</h3>
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="mb-2" style={{ fontFamily: formData.fonts.body }}>
                  This is a paragraph with your selected body font. It shows how your text will appear on your website.
                </p>
                <p style={{ fontFamily: formData.fonts.body }}>
                  Here's another paragraph to demonstrate the readability of longer text passages with your chosen font.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit">
          {initialData ? 'Update Brand' : 'Create Brand'}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;
