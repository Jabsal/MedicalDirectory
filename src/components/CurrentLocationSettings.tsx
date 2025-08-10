import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { MapPin, Edit2 } from "lucide-react";
import { commonLocations } from "@/data/locations";

// Default coordinates for Nigerian locations
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  "Lagos, Lagos State": { lat: 6.5244, lng: 3.3792 },
  "Abuja, FCT": { lat: 9.0765, lng: 7.3986 },
  "Kano, Kano State": { lat: 12.0022, lng: 8.592 },
  "Ibadan, Oyo State": { lat: 7.3775, lng: 3.947 },
  "Port Harcourt, Rivers State": { lat: 4.8156, lng: 7.0498 },
  "Benin City, Edo State": { lat: 6.335, lng: 5.6037 },
  "Kaduna, Kaduna State": { lat: 10.5222, lng: 7.4383 },
  "Enugu, Enugu State": { lat: 6.4474, lng: 7.4983 },
  "Jos, Plateau State": { lat: 9.8965, lng: 8.8583 },
  "Ilorin, Kwara State": { lat: 8.4799, lng: 4.5418 },
  "Owerri, Imo State": { lat: 5.484, lng: 7.0351 },
  "Calabar, Cross River State": { lat: 4.9518, lng: 8.322 },
  "Uyo, Akwa Ibom State": { lat: 5.0515, lng: 7.9327 },
  "Warri, Delta State": { lat: 5.516, lng: 5.75 },
  "Abeokuta, Ogun State": { lat: 7.1475, lng: 3.3619 },
};

// Default location if none is set
const DEFAULT_LOCATION = "Lagos, Lagos State";

interface CurrentLocationSettingsProps {
  onLocationChange: (
    location: string,
    coordinates: { lat: number; lng: number },
  ) => void;
}

export default function CurrentLocationSettings({
  onLocationChange,
}: CurrentLocationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation =
      localStorage.getItem("currentLocation") || DEFAULT_LOCATION;
    setCurrentLocation(savedLocation);

    // Trigger the parent component's handler with the saved location
    const coordinates =
      locationCoordinates[savedLocation] ||
      locationCoordinates[DEFAULT_LOCATION];
    onLocationChange(savedLocation, coordinates);
  }, [onLocationChange]);

  // Filter locations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      const allLocations = commonLocations.map(
        (loc) => `${loc.city}, ${loc.state}`,
      );
      setFilteredLocations(allLocations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = commonLocations
      .filter((loc) =>
        `${loc.city}, ${loc.state}`.toLowerCase().includes(query),
      )
      .map((loc) => `${loc.city}, ${loc.state}`);

    setFilteredLocations(filtered);
  }, [searchQuery]);

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
    localStorage.setItem("currentLocation", location);

    // Get coordinates for this location
    const coordinates = locationCoordinates[location] || {
      // Default to center of the US if unknown
      lat: 39.8283,
      lng: -98.5795,
    };

    onLocationChange(location, coordinates);
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Your Current Location</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Choose your location to see accurate distances to hospitals and
              specialists
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="location-search" className="sr-only">
                Search locations
              </label>
              <Input
                placeholder="Search city, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-md divide-y">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      location === currentLocation
                        ? "bg-primary-50 text-primary font-medium"
                        : ""
                    }`}
                    onClick={() => handleLocationSelect(location)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleLocationSelect(location);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {location}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  No matching locations found
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}