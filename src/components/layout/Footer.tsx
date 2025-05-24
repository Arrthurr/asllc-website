import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { 
      title: 'Company', 
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Our Team', href: '#team' },
        /* { name: 'Careers', href: '#careers' }, */
        { name: 'Contact', href: '#contact' },
      ] 
    },
    { 
      title: 'Services', 
      links: [
        { name: 'Microsoft 365', href: '#services' },
        { name: 'Google Workplace', href: '#services' },
        /* { name: 'Salesforce', href: '#services' }, */
        { name: 'Cloud Migration', href: '#services' },
      ] 
    },
    { 
      title: 'Resources', 
      links: [
        { name: 'Blog', href: '#blog' },
        { name: 'Case Studies', href: '#case-studies' },
        /* { name: 'Guides', href: '#guides' }, */
        { name: 'FAQs', href: '#faqs' },
      ] 
    },
  ];
  
  const socialLinks = [
    /* { name: 'Facebook', icon: <Facebook size={20} />, href: '#' }, */
    { name: 'Twitter', icon: <Twitter size={20} />, href: '#' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, href: '#' },
    { name: 'Email', icon: <Mail size={20} />, href: 'mailto:start@arturosolo.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-gray-400 max-w-md">
              Helping small businesses maximize their cloud service subscriptions with expert guidance and managed solutions.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-primary-300 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-bold text-lg mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-primary-300 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-gray-500">
            &copy; {currentYear} Arturo Solo LLC. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#privacy" className="text-gray-500 hover:text-gray-300">Privacy Policy</a>
            <a href="#terms" className="text-gray-500 hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;