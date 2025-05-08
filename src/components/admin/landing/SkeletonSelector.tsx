import React from 'react';

interface SkeletonSelectorProps {
  onSelectSkeleton: (skeleton: any) => void;
}

const SkeletonSelector = ({ onSelectSkeleton }: SkeletonSelectorProps) => {
  const handleSkeletonSelect = (skeleton: any) => {
    onSelectSkeleton(skeleton);
  };

  // Define skeleton layouts
  const skeletonLayouts = [
    {
      id: '1',
      name: 'Basic',
      structure: ['hero', 'achievements', 'faq', 'footer'],
    },
    {
      id: '2',
      name: 'Sales',
      structure: ['hero', 'painPoints', 'offerStack', 'urgencyCta', 'footer'],
    },
    {
      id: '3',
      name: 'Minimal',
      structure: ['hero', 'footer'],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select a Skeleton Layout</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skeletonLayouts.map((skeleton) => (
          <div
            key={skeleton.id}
            className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleSkeletonSelect(skeleton.structure)}
          >
            <h4 className="font-medium">{skeleton.name}</h4>
            <p className="text-sm text-gray-500">
              {skeleton.structure.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonSelector;