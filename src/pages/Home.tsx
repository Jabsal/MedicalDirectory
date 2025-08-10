import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import {
  Hospital as HospitalIcon,
  User,
  Search,
  MapPin,
  List,
  Map,
} from "lucide-react";
import {
  calculateDistance,
  hospitalCoordinates,
  specialistCoordinates,
} from "@/lib/locationUtils";

import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";
import FilterChips from "@/components/FilterChips";
import HospitalCard from "@/components/HospitalCard";
import SpecialistCard from "@/components/SpecialistCard";
import CarerCard from "@/components/CarerCard";
import MapView from "@/components/MapView";
import CurrentLocationSettings from "@/components/CurrentLocationSettings";
import type { Hospital, Specialist } from "@shared/schema";
import type { FilterOption, SortOption } from "@/lib/types";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"hospitals" | "specialists" | "carers">(
    "hospitals",
  );
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<FilterOption[]>([
    { id: "hospitals", label: "Hospitals", value: "hospitals", active: false },
    {
      id: "specialists",
      label: "Specialists",
      value: "specialists",
      active: false,
    },
    { id: "carers", label: "Carers", value: "carers", active: false },
    { id: "distance", label: "Distance: 5 miles", value: "5", active: false },
    { id: "rating", label: "Highly rated", value: "4", active: false },
  ]);

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Current location state
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 40.7128,
    lng: -74.006, // Default to New York
  });
  const [currentLocationName, setCurrentLocationName] =
    useState("New York, NY");

  // State for showing all results
  const [showAllSpecialists, setShowAllSpecialists] = useState(false);
  const [showAllHospitals, setShowAllHospitals] = useState(false);

  // Queries
  const { data: hospitals = [], isLoading: isLoadingHospitals } = useQuery<
    Hospital[]
  >({
    queryKey: ["/api/hospitals/search", searchQuery, locationQuery, showAllHospitals],
    enabled: activeTab === "hospitals" || searchQuery.length > 0 || showAllHospitals,
  });

  const { data: specialists = [], isLoading: isLoadingSpecialists } = useQuery<
    Specialist[]
  >({
    queryKey: ["/api/specialists/search", searchQuery, locationQuery, showAllSpecialists],
    enabled: true,
  });

  // Query for carers with search
  const { data: carers = [], isLoading: isLoadingCarers } = useQuery<any[]>({
    queryKey: ["/api/carers/search", searchQuery, locationQuery],
    enabled: true, // Always enabled to get count for tab
  });

  // Query for all specialists when "View All" is clicked
  const { data: allSpecialists = [], isLoading: isLoadingAllSpecialists } = useQuery<
    Specialist[]
  >({
    queryKey: ["/api/specialists"],
    enabled: showAllSpecialists,
  });

  // Query for all hospitals when "View All" is clicked
  const { data: allHospitals = [], isLoading: isLoadingAllHospitals } = useQuery<
    Hospital[]
  >({
    queryKey: ["/api/hospitals"],
    enabled: showAllHospitals,
  });

  // Handlers
  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setLocationQuery(location);
    // Reset "show all" states when new search is performed
    setShowAllSpecialists(false);
    setShowAllHospitals(false);

    // Update URL with search params
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    if (location) searchParams.set("location", location);

    setLocation(`/?${searchParams.toString()}`);
  };

  const handleViewAllSpecialists = () => {
    setShowAllSpecialists(true);
    setSearchQuery("");
    setLocationQuery("");
    // Scroll to results section
    const resultsSection = document.querySelector('.bg-gray-50');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAllHospitals = () => {
    setShowAllHospitals(true);
    setSearchQuery("");
    setLocationQuery("");
    // Scroll to results section  
    const resultsSection = document.querySelector('.bg-gray-50');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleFilter = (id: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === id ? { ...filter, active: !filter.active } : filter,
      ),
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  const handleViewHospitalDetails = (id: number) => {
    setLocation(`/hospital/${id}`);
  };

  const handleBookAppointment = (id: number) => {
    toast({
      title: "Appointment Request",
      description: "We'll contact you shortly to schedule your appointment.",
    });
  };

  const handleViewSpecialistDetails = (id: number) => {
    setLocation(`/specialist/${id}`);
  };

  // Handle tab parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");

    if (tabParam === "hospitals") {
      setActiveTab("hospitals");
    } else if (tabParam === "specialists") {
      setActiveTab("specialists");
    }
  }, [window.location.search]); // Re-run effect when URL search params change

  // Use appropriate data source based on "show all" state
  const currentHospitals = showAllHospitals ? allHospitals : hospitals;
  const currentSpecialists = showAllSpecialists ? allSpecialists : specialists;
  const currentLoadingHospitals = showAllHospitals ? isLoadingAllHospitals : isLoadingHospitals;
  const currentLoadingSpecialists = showAllSpecialists ? isLoadingAllSpecialists : isLoadingSpecialists;

  // Calculate distances for hospitals based on current location
  const hospitalsWithDistance = (currentHospitals as Hospital[]).map((hospital) => {
    const coords = hospitalCoordinates[hospital.id];
    let distance = null;

    if (coords) {
      distance = calculateDistance(
        currentLocationCoords.lat,
        currentLocationCoords.lng,
        coords.lat,
        coords.lng,
      );
    }

    return {
      ...hospital,
      distance,
    };
  });

  // Calculate distances for specialists based on current location
  const specialistsWithDistance = (currentSpecialists as Specialist[]).map(
    (specialist) => {
      const coords = specialistCoordinates[specialist.id];
      let distance = null;

      if (coords) {
        distance = calculateDistance(
          currentLocationCoords.lat,
          currentLocationCoords.lng,
          coords.lat,
          coords.lng,
        );
      }

      return {
        ...specialist,
        distance,
      };
    },
  );

  // Sort results based on selected option
  const sortedHospitals = [...hospitalsWithDistance].sort((a, b) => {
    if (sortOption === "distance") {
      const distA = a.distance || Number.MAX_VALUE;
      const distB = b.distance || Number.MAX_VALUE;
      return distA - distB;
    } else if (sortOption === "rating" && a.rating && b.rating) {
      return b.rating - a.rating;
    }
    // Default (relevance) - keep original order
    return 0;
  });

  const sortedSpecialists = [...specialistsWithDistance].sort((a, b) => {
    if (sortOption === "distance") {
      const distA = a.distance || Number.MAX_VALUE;
      const distB = b.distance || Number.MAX_VALUE;
      return distA - distB;
    } else if (sortOption === "rating" && a.rating && b.rating) {
      return b.rating - a.rating;
    }
    // Default (relevance) - keep original order
    return 0;
  });

  // Handle current location change
  const handleLocationChange = (
    locationName: string,
    coordinates: { lat: number; lng: number },
  ) => {
    setCurrentLocationName(locationName);
    setCurrentLocationCoords(coordinates);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find the right medical care
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Search for hospitals and specialists based on your medical needs
            </p>
          </div>

          <SearchBox
            initialQuery={searchQuery}
            initialLocation={locationQuery}
            onSearch={handleSearch}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            <FilterChips
              filters={filters}
              onToggleFilter={handleToggleFilter}
            />

            <div className="flex items-center">
              <CurrentLocationSettings
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>

          {showMoreFilters && (
            <div className="w-full mt-4 bg-white p-4 rounded shadow-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">Any</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="neurology">Neurology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Insurance
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g. Blue Cross"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">Any</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results section */}
      <div className="bg-gray-50 py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "hospitals" | "specialists" | "carers")
            }
          >
            <TabsList className="border-b border-gray-200 w-full justify-start mb-6 bg-transparent">
              <TabsTrigger
                value="hospitals"
                className="border-primary-500 data-[state=active]:text-primary data-[state=active]:border-b-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
              >
                Hospitals ({(currentHospitals as Hospital[]).length})
              </TabsTrigger>
              <TabsTrigger
                value="specialists"
                className="border-primary-500 data-[state=active]:text-primary data-[state=active]:border-b-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
              >
                Specialists ({(currentSpecialists as Specialist[]).length})
              </TabsTrigger>
              <TabsTrigger
                value="carers"
                className="border-primary-500 data-[state=active]:text-primary data-[state=active]:border-b-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
              >
                Carers ({carers.length})
              </TabsTrigger>
            </TabsList>

            {/* Results header */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showAllSpecialists && activeTab === "specialists"
                  ? "All Specialists"
                  : showAllHospitals && activeTab === "hospitals"
                  ? "All Hospitals"
                  : searchQuery
                  ? `${activeTab === "hospitals" ? "Hospitals" : activeTab === "specialists" ? "Specialists" : "Carers"} for "${searchQuery}"`
                  : `${activeTab === "hospitals" ? "Hospitals" : activeTab === "specialists" ? "Specialists" : "Carers"} near you`}
                {locationQuery && !showAllSpecialists && !showAllHospitals && ` near ${locationQuery}`}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) =>
                    value && setViewMode(value as "list" | "map")
                  }
                >
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4 mr-1" /> List
                  </ToggleGroupItem>
                  <ToggleGroupItem value="map" aria-label="Map view">
                    <Map className="h-4 w-4 mr-1" /> Map
                  </ToggleGroupItem>
                </ToggleGroup>

                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Sort by:</span>
                  <select
                    className="ml-2 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            <TabsContent value="hospitals" className="mt-6">
              {currentLoadingHospitals ? (
                <div className="results-grid">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow p-6 animate-pulse"
                    >
                      <div className="h-40 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="flex mt-4 space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedHospitals.length > 0 ? (
                viewMode === "list" ? (
                  <div className="results-grid">
                    {sortedHospitals.map((hospital) => (
                      <HospitalCard
                        key={hospital.id}
                        hospital={hospital}
                        onViewDetails={handleViewHospitalDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <MapView
                    hospitals={sortedHospitals}
                    onViewHospitalDetails={handleViewHospitalDetails}
                  />
                )
              ) : (
                <div className="text-center py-10">
                  <HospitalIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No hospitals found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}

              {/* View All Hospitals button */}
              {sortedHospitals.length > 0 && viewMode === "list" && !showAllHospitals && (searchQuery || locationQuery) && (
                <div className="mt-10 text-center">
                  <button 
                    onClick={handleViewAllHospitals}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    View All Hospitals
                  </button>
                </div>
              )}

              {/* Pagination (simplified) */}
              {sortedHospitals.length > 0 && viewMode === "list" && (
                <div className="mt-10 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {sortedHospitals.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {sortedHospitals.length}
                      </span>{" "}
                      results{showAllHospitals ? " (All Hospitals)" : ""}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specialists" className="mt-6">
              {currentLoadingSpecialists ? (
                <div className="results-grid">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow p-6 animate-pulse"
                    >
                      <div className="flex items-start">
                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedSpecialists.length > 0 ? (
                viewMode === "list" ? (
                  <div className="results-grid">
                    {sortedSpecialists.map((specialist) => (
                      <SpecialistCard
                        key={specialist.id}
                        specialist={specialist}
                        onBookAppointment={handleBookAppointment}
                        onViewDetails={handleViewSpecialistDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <MapView
                    specialists={sortedSpecialists}
                    onBookAppointment={handleBookAppointment}
                    onViewHospitalDetails={handleViewHospitalDetails}
                    onViewSpecialistDetails={handleViewSpecialistDetails}
                  />
                )
              ) : (
                <div className="text-center py-10">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No specialists found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}

              {/* View all specialists button */}
              {sortedSpecialists.length > 0 && viewMode === "list" && !showAllSpecialists && (searchQuery || locationQuery) && (
                <div className="mt-10 text-center">
                  <button 
                    onClick={handleViewAllSpecialists}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    View All Specialists
                  </button>
                </div>
              )}

              {/* Pagination info */}
              {sortedSpecialists.length > 0 && viewMode === "list" && (
                <div className="mt-10 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {sortedSpecialists.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {sortedSpecialists.length}
                      </span>{" "}
                      results{showAllSpecialists ? " (All Specialists)" : ""}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="carers" className="mt-6">
              {isLoadingCarers ? (
                <div className="results-grid">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow p-6 animate-pulse"
                    >
                      <div className="h-40 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="flex mt-4 space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : carers.length > 0 ? (
                <div className="results-grid">
                  {carers.map((carer) => (
                    <CarerCard
                      key={carer.id}
                      carer={carer}
                      onViewDetails={() => console.log('View carer details:', carer.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    {locationQuery ? `No carers found in ${locationQuery}` : "No carers found"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}

              {/* Pagination info */}
              {carers.length > 0 && (
                <div className="mt-10 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {carers.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {carers.length}
                      </span>{" "}
                      results
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
