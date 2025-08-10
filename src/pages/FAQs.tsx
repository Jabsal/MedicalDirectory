import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function FAQs() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Frequently Asked Questions | MedFinder</title>
        <meta name="description" content="Get answers to common questions about finding specialists, booking appointments, insurance coverage, and using MedFinder." />
      </Helmet>

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to the most common questions about finding healthcare providers, 
              insurance coverage, and using our services.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <FAQSection />
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="mb-6 text-gray-600">
                Can't find the answer you're looking for? Please reach out to our customer support team.
              </p>
              <Button onClick={() => window.location.href = 'mailto:support@medfinder.example.com'}>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}