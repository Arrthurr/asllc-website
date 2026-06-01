import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin } from 'lucide-react';
import Section from '../ui/Section';
import { Button } from '../ui/button';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    setIsSubmitting(true);
    // Let the browser handle the native form submission
    // The form will navigate to the action URL or submit to the current page
  };
  
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's build your first AI win</h2>
          <p className="text-xl text-gray-600 mb-8">
            Tell me a bit about your business and what you're trying to do with AI. I'll reply personally, and we'll figure out the right place to start — usually an AI Jumpstart.
          </p>
          
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
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Tell me about your business</h3>
            
            <form
              name="contact"
              method="POST"
              action="/success"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="subject" value="New Contact Request" />
                <p className="hidden">
                  <label>Don't fill this out: <input name="bot-field" /></label>
                </p>
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
                
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
                      What are you interested in?
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">What are you interested in?</option>
                      <option value="ai-jumpstart">AI Jumpstart</option>
                      <option value="custom-ai-build">Custom AI build / implementation</option>
                      <option value="not-sure">Not sure yet — let's talk</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    What are you trying to do with AI?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact;