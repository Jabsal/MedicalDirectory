import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Star, Clock, Shield, MapPin, Stethoscope, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSpecialties } from "@/hooks/useSpecialties";
import { usePopularLocations } from "@/hooks/useLocations";
import type { FilterOption } from "@/lib/types";

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOption[]) => void;
  activeFilters: FilterOption[];
  searchType: 'hospitals' | 'specialists';
}

interface FilterState {
  specialties: string[];
  insurance: string[];
  ratings: [number];
  distance: [number];
  availability: string[];
  services: string[];
  languages: string[];
  priceRange: string;
  emergencyServices: boolean;
  acceptingNewPatients: boolean;
  telehealth: boolean;
}

const insuranceOptions = [
  'NHIS (National Health Insurance)',
  'AIICO Insurance',
  'AXA Mansard',
  'Mutual Benefits Assurance',
  'Leadway Assurance',
  'Cornerstone Insurance',
  'Sovereign Trust Insurance',
  'Niger Insurance',
  'Custodian Investment',
  'ARM HMO',
  'Hygeia HMO',
  'Prepaid Health',
  'Total Health Trust',
  'Reliance HMO',
  'Private Pay',
  'Cash Payment'
];

const availabilityOptions = [
  'Available Today',
  'Available This Week',
  'Weekend Availability',
  'Evening Hours',
  'Same Day Booking',
  '24/7 Emergency',
  'Walk-in Accepted'
];

const hospitalServices = [
  'Emergency Services',
  'Intensive Care Unit',
  'Surgical Services',
  'Maternity Services',
  'Pediatric Care',
  'Radiology',
  'Laboratory Services',
  'Pharmacy',
  'Dialysis',
  'Blood Bank',
  'Ambulance Services',
  'Telemedicine',
  'Home Care Services',
  'Rehabilitation Services',
  'Mental Health Services'
];

const languageOptions = [
  'English',
  'Hausa',
  'Yoruba',
  'Igbo',
  'Pidgin English',
  'French',
  'Arabic',
  'Fulfude',
  'Kanuri',
  'Tiv',
  'Efik',
  'Ibibio'
];

export default function AdvancedFilters({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  activeFilters, 
  searchType 
}: AdvancedFiltersProps) {
  const { data: specialties = [] } = useSpecialties();
  const { data: popularLocations = [] } = usePopularLocations();
  
  const [filterState, setFilterState] = useState<FilterState>({
    specialties: [],
    insurance: [],
    ratings: [0],
    distance: [50],
    availability: [],
    services: [],
    languages: [],
    priceRange: '',
    emergencyServices: false,
    acceptingNewPatients: false,
    telehealth: false
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Initialize filter state from active filters
  useEffect(() => {
    if (activeFilters.length > 0) {
      const newState = { ...filterState };
      
      activeFilters.forEach(filter => {
        if (filter.id.startsWith('specialty-')) {
          newState.specialties.push(filter.value);
        } else if (filter.id.startsWith('insurance-')) {
          newState.insurance.push(filter.value);
        } else if (filter.id.startsWith('service-')) {
          newState.services.push(filter.value);
        } else if (filter.id.startsWith('language-')) {
          newState.languages.push(filter.value);
        } else if (filter.id.startsWith('availability-')) {
          newState.availability.push(filter.value);
        }
      });
      
      setFilterState(newState);
    }
  }, [activeFilters]);

  const handleApplyFilters = () => {
    const filters: FilterOption[] = [];

    // Add specialty filters
    filterState.specialties.forEach(specialty => {
      filters.push({
        id: `specialty-${specialty.toLowerCase().replace(/\s+/g, '-')}`,
        label: specialty,
        value: specialty,
        active: true
      });
    });

    // Add insurance filters
    filterState.insurance.forEach(insurance => {
      filters.push({
        id: `insurance-${insurance.toLowerCase().replace(/\s+/g, '-')}`,
        label: insurance,
        value: insurance,
        active: true
      });
    });

    // Add rating filter
    if (filterState.ratings[0] > 0) {
      filters.push({
        id: `rating-${filterState.ratings[0]}`,
        label: `${filterState.ratings[0]}+ Stars`,
        value: filterState.ratings[0].toString(),
        active: true
      });
    }

    // Add distance filter
    if (filterState.distance[0] < 50) {
      filters.push({
        id: `distance-${filterState.distance[0]}`,
        label: `Within ${filterState.distance[0]}km`,
        value: filterState.distance[0].toString(),
        active: true
      });
    }

    // Add availability filters
    filterState.availability.forEach(availability => {
      filters.push({
        id: `availability-${availability.toLowerCase().replace(/\s+/g, '-')}`,
        label: availability,
        value: availability,
        active: true
      });
    });

    // Add service filters
    filterState.services.forEach(service => {
      filters.push({
        id: `service-${service.toLowerCase().replace(/\s+/g, '-')}`,
        label: service,
        value: service,
        active: true
      });
    });

    // Add language filters
    filterState.languages.forEach(language => {
      filters.push({
        id: `language-${language.toLowerCase().replace(/\s+/g, '-')}`,
        label: language,
        value: language,
        active: true
      });
    });

    // Add boolean filters
    if (filterState.emergencyServices) {
      filters.push({
        id: 'emergency-services',
        label: 'Emergency Services',
        value: 'true',
        active: true
      });
    }

    if (filterState.acceptingNewPatients) {
      filters.push({
        id: 'accepting-new-patients',
        label: 'Accepting New Patients',
        value: 'true',
        active: true
      });
    }

    if (filterState.telehealth) {
      filters.push({
        id: 'telehealth',
        label: 'Telehealth Available',
        value: 'true',
        active: true
      });
    }

    onApplyFilters(filters);
    onClose();
  };

  const handleClearAllFilters = () => {
    setFilterState({
      specialties: [],
      insurance: [],
      ratings: [0],
      distance: [50],
      availability: [],
      services: [],
      languages: [],
      priceRange: '',
      emergencyServices: false,
      acceptingNewPatients: false,
      telehealth: false
    });
    onApplyFilters([]);
  };

  const handleCheckboxChange = (
    category: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    setFilterState(prev => {
      const currentValues = prev[category] as string[];
      if (checked) {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [category]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Advanced Filters
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Refine your search for {searchType === 'hospitals' ? 'hospitals' : 'specialists'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Specialties */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Medical Specialties
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Select specialties you're looking for
                  </p>
                  
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-slate-800">
                    {filteredSpecialties.map(specialty => (
                      <div key={specialty.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`specialty-${specialty.id}`}
                          checked={filterState.specialties.includes(specialty.name)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange('specialties', specialty.name, checked as boolean)
                          }
                        />
                        <Label htmlFor={`specialty-${specialty.id}`} className="text-sm">
                          {specialty.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Insurance Accepted
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-slate-800 mt-3">
                    {insuranceOptions.map(insurance => (
                      <div key={insurance} className="flex items-center space-x-2">
                        <Checkbox
                          id={`insurance-${insurance}`}
                          checked={filterState.insurance.includes(insurance)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange('insurance', insurance, checked as boolean)
                          }
                        />
                        <Label htmlFor={`insurance-${insurance}`} className="text-sm">
                          {insurance}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                {searchType === 'hospitals' && (
                  <div>
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Hospital Services
                    </Label>
                    <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-slate-800 mt-3">
                      {hospitalServices.map(service => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service}`}
                            checked={filterState.services.includes(service)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange('services', service, checked as boolean)
                            }
                          />
                          <Label htmlFor={`service-${service}`} className="text-sm">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* Rating */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Minimum Rating
                  </Label>
                  <div className="mt-3 px-3">
                    <Slider
                      value={filterState.ratings}
                      onValueChange={(value) => setFilterState(prev => ({ ...prev, ratings: value as [number] }))}
                      max={5}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>Any</span>
                      <span className="font-medium">{filterState.ratings[0]}+ Stars</span>
                      <span>5 Stars</span>
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Maximum Distance
                  </Label>
                  <div className="mt-3 px-3">
                    <Slider
                      value={filterState.distance}
                      onValueChange={(value) => setFilterState(prev => ({ ...prev, distance: value as [number] }))}
                      max={100}
                      min={1}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>1km</span>
                      <span className="font-medium">{filterState.distance[0]}km</span>
                      <span>100km+</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Availability
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-slate-800 mt-3">
                    {availabilityOptions.map(availability => (
                      <div key={availability} className="flex items-center space-x-2">
                        <Checkbox
                          id={`availability-${availability}`}
                          checked={filterState.availability.includes(availability)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange('availability', availability, checked as boolean)
                          }
                        />
                        <Label htmlFor={`availability-${availability}`} className="text-sm">
                          {availability}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                {searchType === 'specialists' && (
                  <div>
                    <Label className="text-base font-medium">Languages Spoken</Label>
                    <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50 dark:bg-slate-800 mt-3">
                      {languageOptions.map(language => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`language-${language}`}
                            checked={filterState.languages.includes(language)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange('languages', language, checked as boolean)
                            }
                          />
                          <Label htmlFor={`language-${language}`} className="text-sm">
                            {language}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Filters */}
                <div>
                  <Label className="text-base font-medium">Quick Filters</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emergency-services"
                        checked={filterState.emergencyServices}
                        onCheckedChange={(checked) =>
                          setFilterState(prev => ({ ...prev, emergencyServices: checked as boolean }))
                        }
                      />
                      <Label htmlFor="emergency-services">Emergency Services Available</Label>
                    </div>

                    {searchType === 'specialists' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accepting-new-patients"
                          checked={filterState.acceptingNewPatients}
                          onCheckedChange={(checked) =>
                            setFilterState(prev => ({ ...prev, acceptingNewPatients: checked as boolean }))
                          }
                        />
                        <Label htmlFor="accepting-new-patients">Accepting New Patients</Label>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="telehealth"
                        checked={filterState.telehealth}
                        onCheckedChange={(checked) =>
                          setFilterState(prev => ({ ...prev, telehealth: checked as boolean }))
                        }
                      />
                      <Label htmlFor="telehealth">Telehealth Available</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
            <Button
              variant="outline"
              onClick={handleClearAllFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApplyFilters} className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}