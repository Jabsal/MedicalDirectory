import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  Building2,
  UserRound,
  Star,
  ThumbsUp,
  MapPin,
  X,
  Search,
  Loader2,
  HeartPulse,
  Brain,
  Activity,
  Baby,
  Stethoscope,
  Eye,
  Heart,
  Droplet,
  TestTube,
  Shield
} from "lucide-react";

import { calculateDistance } from "@/lib/locationUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import SearchBox from "@/components/SearchBox";
import FilterChips from "@/components/FilterChips";

import HospitalCard from "@/components/HospitalCard";
import SpecialistCard from "@/components/SpecialistCard";
import CurrentLocationSettings from "@/components/CurrentLocationSettings";
import { useSpecialties } from "@/hooks/useSpecialties";
import { usePopularLocations } from "@/hooks/useLocations";

import type { Hospital, Specialist } from "@shared/schema";
import type { FilterOption, SortOption, SearchParams, HospitalWithDistance, SpecialistWithDistance } from "@/lib/types";

export default function NigerianHome() {
  // Check URL parameters for initial tab
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') === 'specialists' ? 'specialists' : 'hospitals';
  const [activeTab, setActiveTab] = useState<"hospitals" | "specialists">(initialTab);
  const [searchParams, setSearchParams] = useState<SearchParams>({ 
    query: "", 
    location: "",
    distance: undefined,
    distanceUnit: 'miles'
  });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isLoadingSpecialists, setIsLoadingSpecialists] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<FilterOption[]>([]);

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch hospitals based on search parameters
  const fetchHospitals = useCallback(async () => {
    setIsLoadingHospitals(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.query) params.append("q", searchParams.query);
      if (searchParams.specialty) params.append("specialty", searchParams.specialty);
      if (searchParams.location) params.append("location", searchParams.location);

      const response = await fetch(`/api/hospitals/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch hospitals");
      
      let data = await response.json();
      
      // Calculate distances if we have current location
      if (currentLocation) {
        data = data.map((hospital: Hospital) => {
          if (hospital.latitude && hospital.longitude) {
            const distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              hospital.latitude,
              hospital.longitude
            );
            return { ...hospital, distance };
          }
          return hospital;
        });
      }
      
      // Sort the data
      if (sortOption === "distance" && currentLocation) {
        data.sort((a: HospitalWithDistance, b: HospitalWithDistance) => {
          if (a.distance === undefined || a.distance === null) return 1;
          if (b.distance === undefined || b.distance === null) return -1;
          return a.distance - b.distance;
        });
      } else if (sortOption === "rating") {
        data.sort((a: Hospital, b: Hospital) => {
          if (a.rating === null || a.rating === undefined) return 1;
          if (b.rating === null || b.rating === undefined) return -1;
          return b.rating - a.rating;
        });
      }
      
      // Apply filters
      if (filters.length > 0) {
        const activeFilters = filters.filter(f => f.active);
        if (activeFilters.length > 0) {
          data = data.filter((hospital: Hospital) => {
            // For specialty filters
            if (activeFilters.some(f => f.id.startsWith('specialty-'))) {
              const specialtyFilters = activeFilters.filter(f => f.id.startsWith('specialty-'));
              if (specialtyFilters.length > 0 && (!hospital.specialties || hospital.specialties.length === 0)) {
                return false;
              }
              
              const matchesSpecialty = specialtyFilters.every(filter => {
                const specialty = filter.value;
                return hospital.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()));
              });
              
              if (!matchesSpecialty) return false;
            }
            
            // For service filters
            if (activeFilters.some(f => f.id.startsWith('service-'))) {
              const serviceFilters = activeFilters.filter(f => f.id.startsWith('service-'));
              if (serviceFilters.length > 0 && (!hospital.services || hospital.services.length === 0)) {
                return false;
              }
              
              const matchesService = serviceFilters.every(filter => {
                const service = filter.value;
                return hospital.services?.some(s => s.toLowerCase().includes(service.toLowerCase()));
              });
              
              if (!matchesService) return false;
            }
            
            // For insurance filters
            if (activeFilters.some(f => f.id.startsWith('insurance-'))) {
              const insuranceFilters = activeFilters.filter(f => f.id.startsWith('insurance-'));
              if (insuranceFilters.length > 0 && (!hospital.acceptedInsurance || hospital.acceptedInsurance.length === 0)) {
                return false;
              }
              
              const matchesInsurance = insuranceFilters.every(filter => {
                const insurance = filter.value;
                return hospital.acceptedInsurance?.some(i => i.toLowerCase().includes(insurance.toLowerCase()));
              });
              
              if (!matchesInsurance) return false;
            }
            
            return true;
          });
        }
      }
      
      setHospitals(data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setIsLoadingHospitals(false);
    }
  }, [searchParams, sortOption, filters, currentLocation]);

  // Fetch specialists based on search parameters
  const fetchSpecialists = useCallback(async () => {
    setIsLoadingSpecialists(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.query) params.append("q", searchParams.query);
      if (searchParams.specialty) params.append("specialty", searchParams.specialty);
      if (searchParams.location) params.append("location", searchParams.location);

      const response = await fetch(`/api/specialists/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch specialists");
      
      let data = await response.json();
      
      // Calculate distances if we have current location
      if (currentLocation) {
        data = data.map((specialist: Specialist) => {
          if (specialist.latitude && specialist.longitude) {
            const distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              specialist.latitude,
              specialist.longitude
            );
            return { ...specialist, distance };
          }
          return specialist;
        });
      }
      
      // Sort the data
      if (sortOption === "distance" && currentLocation) {
        data.sort((a: SpecialistWithDistance, b: SpecialistWithDistance) => {
          if (a.distance === undefined || a.distance === null) return 1;
          if (b.distance === undefined || b.distance === null) return -1;
          return a.distance - b.distance;
        });
      } else if (sortOption === "rating") {
        data.sort((a: Specialist, b: Specialist) => {
          if (a.rating === null || a.rating === undefined) return 1;
          if (b.rating === null || b.rating === undefined) return -1;
          return b.rating - a.rating;
        });
      }
      
      // Apply filters
      const activeFilters = filters.filter(f => f.active);
      if (activeFilters.length > 0) {
        data = data.filter((specialist: Specialist) => {
          // For specialty filters
          if (activeFilters.some(f => f.id.startsWith('specialty-'))) {
            const specialtyFilters = activeFilters.filter(f => f.id.startsWith('specialty-'));
            const matchesSpecialty = specialtyFilters.every(filter => {
              const specialty = filter.value;
              return (
                specialist.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
                specialist.subspecialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
              );
            });
            
            if (!matchesSpecialty) return false;
          }
          
          // For language filters
          if (activeFilters.some(f => f.id.startsWith('language-'))) {
            const languageFilters = activeFilters.filter(f => f.id.startsWith('language-'));
            if (languageFilters.length > 0 && (!specialist.languages || specialist.languages.length === 0)) {
              return false;
            }
            
            const matchesLanguage = languageFilters.every(filter => {
              const language = filter.value;
              return specialist.languages?.some(l => l.toLowerCase().includes(language.toLowerCase()));
            });
            
            if (!matchesLanguage) return false;
          }
          
          return true;
        });
      }
      
      setSpecialists(data);
    } catch (error) {
      console.error("Error fetching specialists:", error);
    } finally {
      setIsLoadingSpecialists(false);
    }
  }, [searchParams, sortOption, filters, currentLocation]);

  // Load hospitals and specialists only when there are search parameters
  useEffect(() => {
    // Always fetch data to show correct counts, but filter will apply to results
    fetchHospitals();
    fetchSpecialists();
  }, [fetchHospitals, fetchSpecialists, searchParams]);

  // Handle URL parameter changes for tab switching
  useEffect(() => {
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'specialists' || tab === 'hospitals') {
        setActiveTab(tab as "hospitals" | "specialists");
        // Scroll to results section if hash is present
        if (window.location.hash === '#results-section') {
          setTimeout(() => {
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleHashChange);
    
    // Check initial URL on component mount
    handleHashChange();

    return () => {
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleSearch = (query: string, location: string) => {
    setSearchParams(prev => ({ ...prev, query, location }));
  };

  const handleSpecialtyClick = (specialty: string) => {
    setSearchParams(prev => ({ ...prev, specialty }));
    setActiveTab("hospitals"); // Switch to hospitals tab when clicking a specialty
  };

  const handleFilterToggle = (id: string) => {
    setFilters(prev => {
      const filter = prev.find(f => f.id === id);
      if (filter?.active) {
        // If filter is active, remove it completely from the array
        return prev.filter(f => f.id !== id);
      } else {
        // If filter exists but is inactive, make it active
        return prev.map(f => f.id === id ? { ...f, active: true } : f);
      }
    });
  };

  const handleAddFilter = (filter: FilterOption) => {
    setFilters(prev => {
      // Check if filter already exists
      const exists = prev.some(f => f.id === filter.id);
      if (exists) {
        return prev.map(f => f.id === filter.id ? { ...f, active: true } : f);
      } else {
        return [...prev, filter];
      }
    });
  };

  const handleLocationChange = (location: string, coordinates: { lat: number; lng: number }) => {
    setCurrentLocation(coordinates);
    // Optionally update location in search params
    setSearchParams(prev => ({ ...prev, location }));
  };

  // Nigerian specialty cards for the specialty section
  const specialtyCards = [
    { name: "Cardiology", icon: "heart-pulse" },
    { name: "Neurology", icon: "brain" },
    { name: "Orthopaedics", icon: "bone" },
    { name: "Paediatrics", icon: "baby" },
    { name: "Infectious Diseases", icon: "virus" },
    { name: "Gynaecology", icon: "heart" },
    { name: "Haematology", icon: "droplet" },
    { name: "Endocrinology", icon: "flask" },
    { name: "Nephrology", icon: "kidney" },
    { name: "Psychiatry", icon: "brain" }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "heart-pulse":
        return <HeartPulse className="h-6 w-6" />;
      case "brain":
        return <Brain className="h-6 w-6" />;
      case "bone":
        return <Activity className="h-6 w-6" />;
      case "baby":
        return <Baby className="h-6 w-6" />;
      case "virus":
        return <Stethoscope className="h-6 w-6" />;
      case "droplet":
        return <Droplet className="h-6 w-6" />;
      case "flask":
        return <TestTube className="h-6 w-6" />;
      case "kidney":
        return <Activity className="h-6 w-6" />;
      case "eye":
        return <Eye className="h-6 w-6" />;
      case "heart":
        return <Heart className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  const renderNoResultsMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 max-w-md text-center">
          We couldn't find any healthcare providers matching your search criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-green-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              MediFind
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your Gateway to Quality Healthcare Across Nigeria
            </motion.p>
            <motion.p 
              className="text-lg mb-10 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Discover top-rated hospitals, medical specialists, and comprehensive health resources
            </motion.p>
            
            <motion.div 
              className="bg-white rounded-xl shadow-2xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <SearchBox 
                initialQuery={searchParams.query} 
                initialLocation={searchParams.location}
                onSearch={(query, location) => {
                  handleSearch(query, location);
                }}
              />
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <CurrentLocationSettings onLocationChange={handleLocationChange} />
            </motion.div>

            {/* Quick Access Health Features */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-16"
                onClick={() => window.location.href = '/health-dashboard'}
              >
                <div className="text-center">
                  <Activity className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">Health Dashboard</span>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-16"
                onClick={() => window.location.href = '/symptom-chat'}
              >
                <div className="text-center">
                  <Brain className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">AI Symptom Chat</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-16"
                onClick={() => {
                  const element = document.getElementById('disease-surveillance');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="text-center">
                  <Eye className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">Disease Alerts</span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm h-16"
                onClick={() => window.location.href = '/health-dashboard?tab=insurance'}
              >
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">Insurance Guide</span>
                </div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Specialties Section */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Common Medical Specialties in Nigeria</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {specialtyCards.map((specialty, index) => (
            <div 
              key={index} 
              className="rounded-lg border border-border p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-card hover:bg-accent"
              onClick={() => handleSpecialtyClick(specialty.name)}
            >
              <div className="flex justify-center items-center mb-3 text-primary">
                {renderIcon(specialty.icon)}
              </div>
              <h3 className="font-medium text-card-foreground">{specialty.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Section - Nigerian Health System */}
      <div className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Nigeria's Healthcare System</h2>
              <p className="text-muted-foreground mb-4">
                Nigeria's healthcare system is structured into three tiers: primary, secondary, and tertiary care. 
                Primary healthcare centers are the first point of contact, while secondary facilities (general hospitals) 
                provide specialized services. Tertiary institutions like teaching hospitals offer advanced medical care and research.
              </p>
              <p className="text-gray-700 mb-6">
                The National Health Insurance Scheme (NHIS) and various Health Maintenance Organizations (HMOs) 
                work to provide coverage for Nigerians, while private hospitals offer additional options for medical care.
              </p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  NHIS
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  Private Insurance
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  HMOs
                </Badge>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Common Health Concerns</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Malaria prevention and treatment</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Maternal and child health services</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Cardiovascular disease management</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Diabetes care and management</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Infectious disease treatment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
            <div className="sticky top-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-4">Results</h3>
                <div className="space-y-2">
                  <Button 
                    variant={activeTab === "hospitals" ? "default" : "outline"}
                    className={`w-full justify-start ${activeTab === "hospitals" ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => {
                      setActiveTab("hospitals");
                      // Update URL without page reload
                      const newUrl = new URL(window.location.href);
                      newUrl.searchParams.set('tab', 'hospitals');
                      window.history.pushState({}, '', newUrl.toString());
                      // Scroll to results section
                      setTimeout(() => {
                        const resultsSection = document.getElementById('results-section');
                        if (resultsSection) {
                          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Hospitals
                    {hospitals.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {hospitals.length}
                      </Badge>
                    )}
                  </Button>
                  <Button 
                    variant={activeTab === "specialists" ? "default" : "outline"}
                    className={`w-full justify-start ${activeTab === "specialists" ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => {
                      setActiveTab("specialists");
                      // Update URL without page reload
                      const newUrl = new URL(window.location.href);
                      newUrl.searchParams.set('tab', 'specialists');
                      window.history.pushState({}, '', newUrl.toString());
                      // Scroll to results section
                      setTimeout(() => {
                        const resultsSection = document.getElementById('results-section');
                        if (resultsSection) {
                          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    Specialists
                    {specialists.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {specialists.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-4">Sort By</h3>
                <div className="space-y-2">
                  <Button 
                    variant={sortOption === "relevance" ? "default" : "outline"}
                    className={`w-full justify-start ${sortOption === "relevance" ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => setSortOption("relevance")}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Relevance
                  </Button>
                  <Button 
                    variant={sortOption === "rating" ? "default" : "outline"}
                    className={`w-full justify-start ${sortOption === "rating" ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => setSortOption("rating")}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Highest Rated
                  </Button>
                  <Button 
                    variant={sortOption === "distance" ? "default" : "outline"}
                    className={`w-full justify-start ${sortOption === "distance" ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => setSortOption("distance")}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Distance
                  </Button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4" data-filters-section>
                <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="specialties">
                    <AccordionTrigger>Specialties</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {["Cardiology", "Neurology", "Orthopaedics", "Paediatrics", "Infectious Diseases", "Gynaecology"].map((specialty) => (
                          <div key={specialty} className="flex items-center">
                            <Checkbox 
                              id={`specialty-${specialty}`} 
                              checked={filters.some(f => f.id === `specialty-${specialty}` && f.active)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleAddFilter({
                                    id: `specialty-${specialty}`,
                                    label: specialty,
                                    value: specialty,
                                    active: true
                                  });
                                } else {
                                  handleFilterToggle(`specialty-${specialty}`);
                                }
                              }}
                              className="mr-2"
                            />
                            <label 
                              htmlFor={`specialty-${specialty}`}
                              className="text-sm cursor-pointer"
                            >
                              {specialty}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="services">
                    <AccordionTrigger>Services</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {["Emergency", "Surgery", "Radiology", "Intensive Care", "Dialysis"].map((service) => (
                          <div key={service} className="flex items-center">
                            <Checkbox 
                              id={`service-${service}`} 
                              checked={filters.some(f => f.id === `service-${service}` && f.active)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleAddFilter({
                                    id: `service-${service}`,
                                    label: service,
                                    value: service,
                                    active: true
                                  });
                                } else {
                                  handleFilterToggle(`service-${service}`);
                                }
                              }}
                              className="mr-2"
                            />
                            <label 
                              htmlFor={`service-${service}`}
                              className="text-sm cursor-pointer"
                            >
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="insurance">
                    <AccordionTrigger>Insurance</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {["NHIS", "HMO", "Private Insurance", "International Insurance"].map((insurance) => (
                          <div key={insurance} className="flex items-center">
                            <Checkbox 
                              id={`insurance-${insurance}`} 
                              checked={filters.some(f => f.id === `insurance-${insurance}` && f.active)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleAddFilter({
                                    id: `insurance-${insurance}`,
                                    label: insurance,
                                    value: insurance,
                                    active: true
                                  });
                                } else {
                                  handleFilterToggle(`insurance-${insurance}`);
                                }
                              }}
                              className="mr-2"
                            />
                            <label 
                              htmlFor={`insurance-${insurance}`}
                              className="text-sm cursor-pointer"
                            >
                              {insurance}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="distance">
                    <AccordionTrigger>Distance</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-1">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              placeholder="5"
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="1"
                              max="500"
                              defaultValue="5"
                              id="distance-input"
                            />
                            <select 
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                              id="distance-unit"
                            >
                              <option value="miles">miles</option>
                              <option value="km">km</option>
                            </select>
                            <span className="text-sm text-gray-600">radius</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              const distanceInput = document.getElementById('distance-input') as HTMLInputElement;
                              const unitSelect = document.getElementById('distance-unit') as HTMLSelectElement;
                              
                              if (distanceInput?.value && searchParams.location) {
                                const distanceQuery = `${distanceInput.value} ${unitSelect.value}`;
                                handleSearch(distanceQuery, searchParams.location);
                              }
                            }}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Apply Distance Filter
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {activeTab === "specialists" && (
                    <AccordionItem value="languages">
                      <AccordionTrigger>Languages</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-1">
                          {["English", "Yoruba", "Igbo", "Hausa", "French"].map((language) => (
                            <div key={language} className="flex items-center">
                              <Checkbox 
                                id={`language-${language}`} 
                                checked={filters.some(f => f.id === `language-${language}` && f.active)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleAddFilter({
                                      id: `language-${language}`,
                                      label: language,
                                      value: language,
                                      active: true
                                    });
                                  } else {
                                    handleFilterToggle(`language-${language}`);
                                  }
                                }}
                                className="mr-2"
                              />
                              <label 
                                htmlFor={`language-${language}`}
                                className="text-sm cursor-pointer"
                              >
                                {language}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
                
                {filters.filter(f => f.active).length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setFilters(prev => prev.map(f => ({ ...f, active: false })))}
                    className="w-full mt-4 text-green-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1" id="results-section">
            {/* Active filters display */}
            {filters.filter(f => f.active).length > 0 && (
              <div className="mb-4">
                <FilterChips 
                  filters={filters} 
                  onToggleFilter={handleFilterToggle}
                />
              </div>
            )}
            
            {/* Results content */}
            {activeTab === "hospitals" ? (
              <>
                {isLoadingHospitals ? (
                  <div className="flex justify-center my-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : hospitals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospitals.map((hospital) => (
                      <HospitalCard 
                        key={hospital.id} 
                        hospital={hospital} 
                        onViewDetails={(id) => {
                          window.location.href = `/hospital/${id}`;
                        }} 
                      />
                    ))}
                  </div>
                ) : (
                  renderNoResultsMessage()
                )}
              </>
            ) : (
              <>
                {isLoadingSpecialists ? (
                  <div className="flex justify-center my-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : specialists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialists.map((specialist) => (
                      <SpecialistCard 
                        key={specialist.id} 
                        specialist={specialist} 
                        onBookAppointment={(id) => {
                          window.location.href = `/specialist/${id}`;
                        }}
                        onViewDetails={(id) => {
                          window.location.href = `/specialist/${id}`;
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  renderNoResultsMessage()
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}