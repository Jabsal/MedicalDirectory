import { useQuery } from "@tanstack/react-query";
import type { Specialty } from "@shared/schema";

export function useSpecialties() {
  return useQuery<Specialty[]>({
    queryKey: ['/api/specialties'],
    queryFn: async () => {
      const response = await fetch('/api/specialties');
      if (!response.ok) {
        throw new Error('Failed to fetch specialties');
      }
      return response.json();
    },
  });
}