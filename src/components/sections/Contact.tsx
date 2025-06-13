import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, CheckCircle } from 'lucide-react';
import Section from '../ui/Section';
import { Button } from '../ui/button';

const Contact: React.FC = () => {
  // State to track form submission status for UI feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form state for controlled inputs
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  
  /**
   * Handle input changes and update form state
   * This maintains controlled component behavior for better UX
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  /**
   * Handle form submission
   * With Netlify forms, we don't need custom submission logic
   * The form will be processed by Netlify automatically
   */
  const handleSubmit = (e: React.FormEvent) => {
    // Let Netlify handle the form submission
    // The form will redirect to a success page or show a success message
    // based on Netlify's configuration
    
    // Optional: You can add client-side validation here if needed
    // For now, we'll rely on HTML5 validation attributes
  };
  
  // Contact information data
  const contactInfo = [
    { 
      icon: <Phone className="w-6 h-6 text-primary-500" />, 
      label: 'Call Us', 
      value: '‪(602) 888-6225‬',
      link: 'tel:+‪6028886225‬'
    },
    { 
      icon: <MapPin className="w-6 h-6 text-primary-500" />, 
      label: 'Visit Us', 
      value: 'Phoenix, AZ',
      link: '#'
    },
  ];

  return (
    <Section id="contact" background="secondary">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to optimize your cloud services? Contact us for a free consultation and let's discuss how we can help your business thrive.
          </p>
          
          {/* Contact Information Cards */}
          <div className="space-y-6 mb-10">
            {contactInfo.map((item, index) => (
              item && (
                <div key={index} className="flex items-start">
                  <div className="p-3 bg-white rounded-full shadow-md mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    <a href={item.link} className="text-gray-600 hover:text-primary-600 transition-colors">
                      {item.value}
                    </a>
                  </div>
                </div>
              )
            ))}
          </div>
          
          {/* Office Hours Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">Our Office Hours (GMT-7)</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday:</span>
                <span className="font-medium">8:30 AM - 4:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday:</span>
                <span className="font-medium">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday:</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Request a Consultation</h3>
            
            {/* 
              Netlify Form Configuration:
              - name: Identifies the form in Netlify dashboard
              - data-netlify: Enables Netlify form processing
              - method: POST is required for Netlify forms
              - netlify-honeypot: Spam protection field (hidden)
            */}
            <form 
              name="contact" 
              method="POST" 
              data-netlify="true" 
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Hidden honeypot field for spam protection */}
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <label>
                  Don't fill this out if you're human: 
                  <input name="bot-field" />
                </label>
              </div>
              
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              {/* Company and Service Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formState.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a service</option>
                    <option value="microsoft365">Microsoft 365 Optimization</option>
                    <option value="googleWorkplace">Google Workplace Management</option>
                    <option value="license">License Optimization</option>
                    <option value="migration">Cloud Migration</option>
                  </select>
                </div>
              </div>
              
              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your current cloud setup and what challenges you're facing..."
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                >
                  Send Message
                </Button>
              </div>
              
              {/* Form Submission Note */}
              <p className="text-sm text-gray-500 text-center">
                We'll get back to you within 24 hours during business days.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact;