import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  Globe, 
  Users, 
  CheckCircle,
  Star,
  Building,
  Shield,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InsuranceProvider {
  id: string;
  name: string;
  type: 'NHIS' | 'HMO' | 'Private' | 'Corporate';
  coverage: string[];
  states: string[];
  phoneNumber: string;
  website?: string;
  address: string;
  rating: number;
  enrollees: string;
  benefits: string[];
  premiumRange: string;
  logo?: string;
}

const insuranceProviders: InsuranceProvider[] = [
  {
    id: '1',
    name: 'National Health Insurance Scheme (NHIS)',
    type: 'NHIS',
    coverage: ['Basic Healthcare', 'Emergency Services', 'Maternal Care', 'Child Healthcare', 'Drug Coverage'],
    states: ['All 36 States + FCT'],
    phoneNumber: '0800-NHIS-HELP (0800-6447-4357)',
    website: 'https://www.nhis.gov.ng',
    address: 'Plot 279, Samuel Ademulegun Street, Central Business District, Abuja',
    rating: 3.8,
    enrollees: '12M+',
    benefits: [
      'Subsidized healthcare for formal sector workers',
      'Family coverage including dependents',
      'Access to primary, secondary, and tertiary care',
      'Drug benefits with essential medicines list'
    ],
    premiumRange: '₦500 - ₦15,000/month'
  },
  {
    id: '2',
    name: 'Hygeia HMO',
    type: 'HMO',
    coverage: ['Comprehensive Medical', 'Dental Care', 'Optical Services', 'Specialist Consultations'],
    states: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin'],
    phoneNumber: '+234-1-271-6000',
    website: 'https://www.hygeiahmo.com',
    address: '39 Alfred Rewane Road, Ikoyi, Lagos',
    rating: 4.2,
    enrollees: '500K+',
    benefits: [
      'Cashless medical services',
      '24/7 emergency response',
      'Online consultation services',
      'Health and wellness programs'
    ],
    premiumRange: '₦25,000 - ₦150,000/year'
  },
  {
    id: '3',
    name: 'Leadway Health',
    type: 'HMO',
    coverage: ['Primary Care', 'Specialist Care', 'Surgery', 'Maternity', 'Emergency'],
    states: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Kaduna'],
    phoneNumber: '+234-1-280-9999',
    website: 'https://www.leadwayhealth.com',
    address: '1 Mekunwen Road, Brains & Hammers Estate, Life Camp, Abuja',
    rating: 4.1,
    enrollees: '300K+',
    benefits: [
      'Telemedicine services',
      'Health screening and preventive care',
      'Prescription drug coverage',
      'Family health plans available'
    ],
    premiumRange: '₦30,000 - ₦200,000/year'
  },
  {
    id: '4',
    name: 'Reliance HMO',
    type: 'HMO',
    coverage: ['General Practice', 'Specialist Consultations', 'Laboratory Services', 'Radiology'],
    states: ['Lagos', 'Ogun', 'Oyo', 'Abuja', 'Rivers'],
    phoneNumber: '+234-1-271-6697',
    website: 'https://www.reliancehmo.com',
    address: '12th Floor, UBA House, 57 Marina Street, Lagos',
    rating: 3.9,
    enrollees: '250K+',
    benefits: [
      'Wide network of healthcare providers',
      'Flexible payment options',
      'Corporate health insurance plans',
      'Health education and promotion'
    ],
    premiumRange: '₦20,000 - ₦120,000/year'
  },
  {
    id: '5',
    name: 'AXA Mansard Health',
    type: 'Private',
    coverage: ['Premium Healthcare', 'International Coverage', 'Executive Health', 'Wellness Programs'],
    states: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'],
    phoneNumber: '+234-1-271-5555',
    website: 'https://www.axamansard.com',
    address: 'AXA Mansard House, 1684 Sanusi Fafunwa Street, Victoria Island, Lagos',
    rating: 4.5,
    enrollees: '150K+',
    benefits: [
      'Premium hospital network access',
      'International medical coverage',
      'Executive health check-ups',
      'Concierge medical services'
    ],
    premiumRange: '₦100,000 - ₦500,000/year'
  },
  {
    id: '6',
    name: 'AIICO Insurance',
    type: 'Private',
    coverage: ['Life Insurance', 'Health Insurance', 'Critical Illness', 'Disability Coverage'],
    states: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Jos'],
    phoneNumber: '+234-1-279-9944',
    website: 'https://www.aiicoplc.com',
    address: 'AIICO Plaza, Plot PC12, Afribank Street, Victoria Island, Lagos',
    rating: 4.0,
    enrollees: '200K+',
    benefits: [
      'Life and health insurance combination',
      'Critical illness coverage',
      'Flexible premium payment',
      'Retirement health planning'
    ],
    premiumRange: '₦50,000 - ₦300,000/year'
  }
];

export default function InsuranceLocator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [filteredProviders, setFilteredProviders] = useState(insuranceProviders);

  const filterProviders = () => {
    let filtered = insuranceProviders;

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.coverage.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.type === selectedType);
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(provider =>
        provider.states.some(state => 
          state.toLowerCase().includes(selectedState.toLowerCase()) ||
          state.includes('All 36 States')
        )
      );
    }

    setFilteredProviders(filtered);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NHIS': return 'bg-green-100 text-green-800';
      case 'HMO': return 'bg-blue-100 text-blue-800';
      case 'Private': return 'bg-purple-100 text-purple-800';
      case 'Corporate': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    return stars;
  };

  // Apply filters when search parameters change
  useEffect(() => {
    filterProviders();
  }, [searchTerm, selectedType, selectedState]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nigerian Health Insurance Directory</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the right health insurance provider for you and your family. Compare coverage, 
          benefits, and costs across Nigeria's leading health insurance companies.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by provider name or coverage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Insurance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="NHIS">NHIS</SelectItem>
                <SelectItem value="HMO">HMO</SelectItem>
                <SelectItem value="Private">Private Insurance</SelectItem>
                <SelectItem value="Corporate">Corporate Plans</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja (FCT)</SelectItem>
                <SelectItem value="Kano">Kano</SelectItem>
                <SelectItem value="Rivers">Rivers</SelectItem>
                <SelectItem value="Oyo">Oyo</SelectItem>
                <SelectItem value="Kaduna">Kaduna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={filterProviders} className="mt-4 w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Insurance Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProviders.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <span className="text-lg">{provider.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getTypeColor(provider.type)}>
                        {provider.type}
                      </Badge>
                      <div className="flex items-center">
                        {renderStars(provider.rating)}
                        <span className="ml-1 text-sm text-gray-600">
                          {provider.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {provider.enrollees}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{provider.phoneNumber}</span>
                  </div>
                  {provider.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <span>{provider.address}</span>
                  </div>
                </div>

                {/* Coverage Areas */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Coverage Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.states.map((state, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Services Covered</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.coverage.slice(0, 4).map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {provider.coverage.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.coverage.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Benefits</h4>
                  <ul className="space-y-1">
                    {provider.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-xs">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Premium Range */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Premium Range:</span>
                    <span className="text-sm font-bold text-green-600">{provider.premiumRange}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Get Quote
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            How to Choose the Right Health Insurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Consider These Factors:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Coverage area and provider network in your location</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Services covered vs. your healthcare needs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Premium costs and payment flexibility</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                  <span>Customer service quality and claim processing</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Popular Combinations:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Budget-conscious:</strong> NHIS + HMO for additional coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Comprehensive:</strong> Private insurance with international coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Corporate:</strong> Employer-sponsored HMO plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Family:</strong> Family-friendly HMO with maternity coverage</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}