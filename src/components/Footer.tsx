import React from 'react';
import { FooterData } from '@/components/admin/PageEditor';

interface FooterProps {
  customData?: Partial<FooterData>;
}

const Footer = ({ customData }: FooterProps) => {
  // Merge default data with custom data if provided
  const defaultFooterData: FooterData = {
    // Placeholder for copyright, this should be fetched from admin panel settings
    copyright: customData?.copyright || `© ${new Date().getFullYear()} IDesign Ads. All rights reserved.`,
    quickLinks: [
      { label: "Services", url: "#" },
      { label: "Case Studies", url: "#testimonials" },
      { label: "FAQ", url: "#faq" },
      { label: "Contact", url: "#" }
    ],
    socialLinks: [
      { label: "Facebook", url: "#" },
      { label: "Instagram", url: "#" },
      { label: "LinkedIn", url: "#" }
    ],
    contactInfo: {
      address: "Business Bay, Dubai, UAE",
      email: "info@idesignads.ae",
      phone: "+971 4 123 4567"
    }
  };
  
  const data = customData ? { ...defaultFooterData, ...customData } : defaultFooterData;
  
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">
              <span className="text-highlight">I</span>Design Ads
            </h3>
            <p className="mb-4 text-gray-400">
              The UAE's Most Awarded Signage Team, creating high-conversion signage solutions that drive business growth and maximize visibility.
            </p>
            <div className="flex space-x-4">
              {data.socialLinks.map((link, index) => (
                <a key={index} href={link.url} className="hover:text-highlight transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {data.quickLinks.map((link, index) => (
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
              <p className="mb-2">{data.contactInfo.address}</p>
              <p className="mb-2">Email: {data.contactInfo.email}</p>
              <p className="mb-2">Phone: {data.contactInfo.phone}</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            {data.copyright}
          </p>
          <a href="/admin/dashboard" className="text-xs text-gray-600 hover:text-gray-400 transition-colors block mt-1">
            Admin Dashboard
          </a>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
