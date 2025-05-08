
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Key, File, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BrandForm from "./BrandForm";
import { Brand } from "@/types/brand";

const BrandManager = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("brands");

  useEffect(() => {
    // Load brands from localStorage
    const savedBrands = localStorage.getItem('brands');
    if (savedBrands) {
      try {
        setBrands(JSON.parse(savedBrands));
      } catch (error) {
        console.error('Failed to parse brands:', error);
      }
    } else {
      // Initialize with default brand if none exist
      const defaultBrand = {
        id: '1',
        name: 'IDesign Ads',
        description: 'The UAE\'s Most Awarded Signage Team',
        logo: '/logo.svg',
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
        },
        createdAt: new Date().toISOString(),
      };
      setBrands([defaultBrand]);
      localStorage.setItem('brands', JSON.stringify([defaultBrand]));
    }
  }, []);

  const handleCreateBrand = (brand: Omit<Brand, 'id' | 'createdAt'>) => {
    const newBrand: Brand = {
      ...brand,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedBrands = [...brands, newBrand];
    setBrands(updatedBrands);
    localStorage.setItem('brands', JSON.stringify(updatedBrands));
    
    setIsCreateDialogOpen(false);
    toast({
      title: "Brand created",
      description: `${brand.name} has been created successfully`,
    });
  };

  const handleUpdateBrand = (brand: Brand) => {
    const updatedBrands = brands.map(b => b.id === brand.id ? brand : b);
    setBrands(updatedBrands);
    localStorage.setItem('brands', JSON.stringify(updatedBrands));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Brand updated",
      description: `${brand.name} has been updated successfully`,
    });
  };

  const handleDeleteBrand = () => {
    if (!selectedBrand) return;
    
    const updatedBrands = brands.filter(brand => brand.id !== selectedBrand.id);
    setBrands(updatedBrands);
    localStorage.setItem('brands', JSON.stringify(updatedBrands));
    
    setIsDeleteDialogOpen(false);
    setSelectedBrand(null);
    toast({
      title: "Brand deleted",
      description: `${selectedBrand.name} has been deleted successfully`,
    });
  };

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brand Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
            </DialogHeader>
            <BrandForm onSubmit={handleCreateBrand} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="assets">Brand Assets</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brands" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map(brand => (
              <Card key={brand.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {brand.logo ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <Key className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardTitle>{brand.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{brand.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    {Object.entries(brand.colors).slice(0, 5).map(([key, color]) => (
                      <div 
                        key={key}
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={key}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(brand.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(brand)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(brand)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Logos & Brand Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="border p-4 rounded-md flex items-center gap-3">
                    <File className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Logo Primary</p>
                      <p className="text-xs text-gray-500">PNG, 200 KB</p>
                    </div>
                  </div>
                  <div className="border p-4 rounded-md flex items-center gap-3">
                    <File className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Logo Alternative</p>
                      <p className="text-xs text-gray-500">SVG, 32 KB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Logo
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Palettes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <div className="bg-[#4338ca] w-8 h-8 rounded"></div>
                  <div className="bg-[#9b87f5] w-8 h-8 rounded"></div>
                  <div className="bg-[#ea384c] w-8 h-8 rounded"></div>
                  <div className="bg-[#2d2d2d] w-8 h-8 rounded"></div>
                  <div className="bg-[#f5f5f5] w-8 h-8 rounded border"></div>
                </div>
                <p className="text-sm text-gray-500">Primary Palette</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Palette
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Headings</p>
                    <p className="text-2xl font-bold">Aa Bb Cc 123</p>
                    <p className="text-xs text-gray-500 mt-1">Montserrat, Sans-serif</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Body</p>
                    <p className="text-base">Aa Bb Cc 123</p>
                    <p className="text-xs text-gray-500 mt-1">Open Sans, Sans-serif</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Font
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Brand Templates</CardTitle>
                <CardDescription>Document templates & style guides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="border p-4 rounded-md flex items-center gap-3">
                    <Folder className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Landing Page Templates</p>
                      <p className="text-xs text-gray-500">3 templates</p>
                    </div>
                  </div>
                  <div className="border p-4 rounded-md flex items-center gap-3">
                    <Folder className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Style Guides</p>
                      <p className="text-xs text-gray-500">1 document</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Template
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {selectedBrand && (
            <BrandForm initialData={selectedBrand} onSubmit={handleUpdateBrand} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{selectedBrand?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteBrand}>Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandManager;
