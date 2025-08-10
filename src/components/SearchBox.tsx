import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { commonLocations } from "@/data/locations";
import { popularHospitals } from "@/data/hospitals";
import type { Specialty } from "@shared/schema";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBoxProps {
  initialQuery?: string;
  initialLocation?: string;
  onSearch: (query: string, location: string) => void;
}

export default function SearchBox({ initialQuery = '', initialLocation = '', onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  
  const [openSpecialty, setOpenSpecialty] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  
  const specialtyInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Fetch specialties from database
  const { data: specialtiesList = [] } = useQuery<Specialty[]>({
    queryKey: ["/api/specialties"],
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
    setOpenSpecialty(false);
    setOpenLocation(false);
    
    // Provide immediate feedback to user
    if (query.trim() || location.trim()) {
      // Scroll to results section to show search feedback
      setTimeout(() => {
        const resultsSection = document.querySelector('.bg-gray-50');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchQuery: string, searchLocation: string) => {
      onSearch(searchQuery, searchLocation);
    }, 500),
    [onSearch]
  );

  // Handle real-time search as user types
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    // Trigger search immediately if query is meaningful (3+ chars) or empty
    if (newQuery.trim().length >= 3 || newQuery.trim().length === 0) {
      debouncedSearch(newQuery, location);
    }
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // Trigger search immediately when location changes meaningfully
    if (newLocation.trim().length >= 3 || newLocation.trim().length === 0) {
      debouncedSearch(query, newLocation);
    }
  };

  // Simple debounce function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(undefined, args), wait);
    };
  }
  
  // Close popover when pressing escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenSpecialty(false);
        setOpenLocation(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Filter specialties and hospitals based on query
  const filteredSpecialties = query.trim() === '' 
    ? specialtiesList 
    : specialtiesList.filter(specialty => 
        specialty.name.toLowerCase().includes(query.toLowerCase())
      );
      
  // Filter hospitals based on query
  const filteredHospitals = query.trim() === ''
    ? []  // Don't show hospitals by default when no query
    : popularHospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(query.toLowerCase())
      );
      
  // Filter locations based on input with better matching
  const filteredLocations = location.trim() === ''
    ? commonLocations.slice(0, 12) // Show top 12 locations when empty
    : commonLocations.filter(loc => {
        const searchStr = `${loc.city} ${loc.state}`.toLowerCase();
        const searchTerm = location.toLowerCase().trim();
        return searchStr.includes(searchTerm) || 
               loc.city.toLowerCase().startsWith(searchTerm) ||
               loc.state.toLowerCase().includes(searchTerm) ||
               loc.city.toLowerCase().includes(searchTerm);
      }).slice(0, 12); // Limit to 12 suggestions

  return (
    <div className="mt-10">
      <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row shadow-md rounded-lg overflow-hidden">
          <div className="flex-1 relative">
            <Popover open={openSpecialty} onOpenChange={setOpenSpecialty}>
              <PopoverTrigger asChild>
                <div>
                  <label htmlFor="specialty" className="sr-only">Medical specialty</label>
                  <Input
                    id="specialty"
                    ref={specialtyInputRef}
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onClick={() => setOpenSpecialty(true)}
                    className="block w-full px-4 py-3.5 border-0 focus:ring-0 focus:outline-none rounded-none"
                    placeholder="Search by specialty, hospital name, carers, or doctor (e.g. Cardiology, LUTH, Elderly Care)"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[350px]" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    
                    {filteredSpecialties.length > 0 && (
                      <CommandGroup heading="Medical Specialties">
                        {filteredSpecialties.map((specialty) => (
                          <CommandItem
                            key={`specialty-${specialty.id}`}
                            onSelect={() => {
                              setQuery(specialty.name);
                              onSearch(specialty.name, location);
                              setOpenSpecialty(false);
                              locationInputRef.current?.focus();
                            }}
                            className="flex items-center"
                          >
                            <div className="flex-1">{specialty.name}</div>
                            {specialty.name.toLowerCase() === query.toLowerCase() && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    {filteredHospitals.length > 0 && (
                      <CommandGroup heading="Hospitals">
                        {filteredHospitals.map((hospital) => (
                          <CommandItem
                            key={`hospital-${hospital.id}`}
                            onSelect={() => {
                              const newLocation = `${hospital.city}, ${hospital.state}`;
                              setQuery(hospital.name);
                              setLocation(newLocation);
                              onSearch(hospital.name, newLocation);
                              setOpenSpecialty(false);
                            }}
                            className="flex items-center"
                          >
                            <div className="flex-1">
                              <div>{hospital.name}</div>
                              <div className="text-sm text-gray-500">{hospital.city}, {hospital.state}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="border-t sm:border-t-0 sm:border-l border-gray-200 relative flex-1 max-w-sm">
            <Popover open={openLocation} onOpenChange={(open) => {
              setOpenLocation(open);
              if (!open) {
                setLocationFocused(false);
              }
            }}>
              <PopoverTrigger asChild>
                <div className={`flex items-center transition-all duration-200 ${
                  locationFocused || openLocation ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}>
                  <MapPin className={`ml-3 h-5 w-5 transition-colors duration-200 ${
                    locationFocused || openLocation ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <Input
                    id="location"
                    ref={locationInputRef}
                    value={location}
                    onChange={(e) => {
                      handleLocationChange(e.target.value);
                      if (!openLocation) {
                        setOpenLocation(true);
                      }
                    }}
                    onFocus={() => {
                      setLocationFocused(true);
                      setOpenLocation(true);
                    }}
                    onBlur={() => {
                      // Delay blur to allow for popover interactions
                      setTimeout(() => {
                        setLocationFocused(false);
                      }, 150);
                    }}
                    className="block w-full pl-2 pr-4 py-3.5 border-0 focus:ring-0 focus:outline-none rounded-none bg-transparent"
                    placeholder="Location: Lagos, Abuja, Port Harcourt..."
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent 
                className="p-0 w-[350px] border-2 border-blue-200 dark:border-blue-800 shadow-xl" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 px-4 py-3 border-b">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                    🌍 Choose Your Location
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Select from popular Nigerian cities to find nearby healthcare
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <div className="p-4 text-center">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">
                        No matching locations found.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Try typing a city name like "Lagos" or "Abuja"
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800">
                        Popular Nigerian Cities
                      </div>
                      {filteredLocations.map((loc, index) => (
                        <div
                          key={loc.id}
                          onClick={() => {
                            const newLocation = `${loc.city}, ${loc.state}`;
                            setLocation(newLocation);
                            setOpenLocation(false);
                            setLocationFocused(false);
                            // Trigger search immediately when location is selected
                            onSearch(query, newLocation);
                          }}
                          className={`flex items-center px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-150 group ${
                            index === 0 ? 'bg-blue-25 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <MapPin className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors">
                              {loc.city}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                              {loc.state}, Nigeria
                            </div>
                          </div>
                          {`${loc.city}, ${loc.state}`.toLowerCase() === location.toLowerCase() && (
                            <Check className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 border-t text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <div className="flex-1">
                    💡 Tip: You can also type custom locations like "Victoria Island, Lagos"
                  </div>
                  {location.trim() && !filteredLocations.some(loc => 
                    `${loc.city}, ${loc.state}`.toLowerCase() === location.toLowerCase()
                  ) && (
                    <button
                      onClick={() => {
                        setOpenLocation(false);
                        setLocationFocused(false);
                        onSearch(query, location);
                      }}
                      className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Use "{location}"
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            type="submit" 
            className="bg-primary px-6 py-4 text-white font-medium hover:bg-primary rounded-none h-auto"
            onClick={() => {
              setOpenSpecialty(false);
              setOpenLocation(false);
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
