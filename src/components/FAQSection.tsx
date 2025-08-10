import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

// FAQ data structure
interface FAQ {
  question: string;
  answer: string;
}

const generalFAQs: FAQ[] = [
  {
    question: "How do I find a specialist in my area?",
    answer: "You can find specialists in your area by using the search box on our homepage. Enter your location and specific specialty you're looking for, then click 'Search'. You can filter results by distance, ratings, and other criteria."
  },
  {
    question: "How are hospitals and doctors rated?",
    answer: "Hospitals and doctors are rated based on patient reviews and feedback. Our rating system considers factors like wait times, staff friendliness, treatment effectiveness, and overall patient satisfaction. All ratings are from verified patients."
  },
  {
    question: "Can I book appointments through this website?",
    answer: "Yes, you can request appointments directly through our platform. When viewing a specialist's profile, click the 'Book Appointment' button and follow the prompts. The doctor's office will contact you to confirm the appointment details."
  },
  {
    question: "How do I write a review?",
    answer: "To write a review, navigate to the profile page of the hospital or specialist you want to review. Click the 'Write a Review' button and fill out the review form. You'll be able to rate different aspects of your experience and provide detailed feedback."
  },
  {
    question: "What happens when I subscribe to updates?",
    answer: "When you subscribe to updates for a hospital, specialist, or health topic, you'll receive email notifications about new information, such as when new specialists join a hospital, when new reviews are posted, or when new articles are published on your topics of interest."
  }
];

const insuranceFAQs: FAQ[] = [
  {
    question: "How do I know if a doctor accepts my insurance?",
    answer: "On each specialist's profile, you can see if they're marked as 'In-network' with most insurances. For specific insurance plans, we recommend contacting the specialist's office directly to confirm coverage."
  },
  {
    question: "What does 'in-network' mean?",
    answer: "'In-network' means the doctor or hospital has a contract with your health insurance company. When you visit an in-network provider, you typically pay less out-of-pocket than you would for an out-of-network provider."
  },
  {
    question: "Does this site provide information on treatment costs?",
    answer: "While we don't provide specific pricing information for treatments, many hospital profiles include general information about their pricing transparency and payment options. For accurate cost estimates, we recommend contacting the facility directly."
  }
];

const techFAQs: FAQ[] = [
  {
    question: "Is my personal information secure on this website?",
    answer: "Yes, we take data security seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your explicit consent, and we follow strict privacy protocols to protect your data."
  },
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Login' button in the top-right corner of the page, then click 'Forgot Password'. Enter the email address associated with your account, and we'll send you instructions to create a new password."
  },
  {
    question: "Can I use this website on my mobile device?",
    answer: "Yes, our website is fully responsive and works on all devices including smartphones, tablets, and desktop computers. You can access all features while on the go."
  }
];

interface FAQSectionProps {
  className?: string;
}

export default function FAQSection({ className }: FAQSectionProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 ${className || ''}`}>
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">General Questions</h3>
        <Accordion type="single" collapsible className="bg-white rounded-lg border">
          {generalFAQs.map((faq, index) => (
            <AccordionItem key={`general-${index}`} value={`general-${index}`}>
              <AccordionTrigger className="px-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 prose prose-sm max-w-none">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Insurance & Payments</h3>
        <Accordion type="single" collapsible className="bg-white rounded-lg border">
          {insuranceFAQs.map((faq, index) => (
            <AccordionItem key={`insurance-${index}`} value={`insurance-${index}`}>
              <AccordionTrigger className="px-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 prose prose-sm max-w-none">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Technical Support</h3>
        <Accordion type="single" collapsible className="bg-white rounded-lg border">
          {techFAQs.map((faq, index) => (
            <AccordionItem key={`tech-${index}`} value={`tech-${index}`}>
              <AccordionTrigger className="px-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 prose prose-sm max-w-none">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}