import { useQuery } from "@tanstack/react-query";
import type { Location } from "@shared/schema";

export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ['/api/locations'],
    queryFn: async () => {
      const response = await fetch('/api/locations');
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      return response.json();
    },
  });
}

export function usePopularLocations() {
  return useQuery<Location[]>({
    queryKey: ['/api/locations/popular'],
    queryFn: async () => {
      const response = await fetch('/api/locations/popular');
      if (!response.ok) {
        throw new Error('Failed to fetch popular locations');
      }
      return response.json();
    },
  });
}