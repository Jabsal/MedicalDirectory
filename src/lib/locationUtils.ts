// Simple formula to calculate distances between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in miles
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Coordinates for hospitals and specialists
export const hospitalCoordinates: Record<number, { lat: number; lng: number }> = {
  1: { lat: 42.3626, lng: -71.0677 },  // Massachusetts General Hospital (Boston)
  2: { lat: 40.7421, lng: -73.9883 },  // NYU Langone Health (New York)
  3: { lat: 41.8901, lng: -87.6199 },  // Northwestern Memorial Hospital (Chicago)
  4: { lat: 34.0631, lng: -118.1697 }, // Cedars-Sinai Medical Center (Los Angeles)
  5: { lat: 37.7749, lng: -122.4194 }, // UCSF Medical Center (San Francisco)
  6: { lat: 29.7132, lng: -95.3963 },  // Houston Methodist Hospital (Houston)
  7: { lat: 39.9526, lng: -75.1825 },  // Penn Medicine (Philadelphia)
  8: { lat: 37.5636, lng: -77.4699 },  // VCU Medical Center (Richmond)
  9: { lat: 47.6073, lng: -122.3355 }, // UW Medical Center (Seattle)
  10: { lat: 33.7790, lng: -84.3880 }, // Emory University Hospital (Atlanta)
};

export const specialistCoordinates: Record<number, { lat: number; lng: number }> = {
  1: { lat: 42.3605, lng: -71.0695 },  // Dr. Sarah Johnson
  2: { lat: 40.7412, lng: -73.9880 },  // Dr. Michael Chen
  3: { lat: 41.8917, lng: -87.6213 },  // Dr. Emily Rodriguez
  4: { lat: 34.0610, lng: -118.1690 }, // Dr. James Smith
  5: { lat: 37.7740, lng: -122.4184 }, // Dr. Lisa Patel
  6: { lat: 29.7142, lng: -95.3968 },  // Dr. David Wilson
  7: { lat: 39.9519, lng: -75.1819 },  // Dr. Rebecca Lee
  8: { lat: 37.5646, lng: -77.4717 },  // Dr. Robert Thompson
  9: { lat: 47.6066, lng: -122.3341 }, // Dr. Jennifer Garcia
  10: { lat: 33.7783, lng: -84.3870 }, // Dr. William Davis
};

// Format distance for display
export function formatDistance(distance: number | null | undefined): string {
  if (distance === undefined || distance === null) {
    return 'Distance unknown';
  }
  
  return `${distance} ${distance === 1 ? 'mile' : 'miles'} away`;
}