import { Hospital, Specialist, Specialty } from "@shared/schema";

export interface SearchParams {
  query: string;
  specialty?: string;
  location?: string;
  distance?: number;
  distanceUnit?: 'miles' | 'km';
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  active: boolean;
}

export interface HospitalWithDistance extends Hospital {
  distance?: number;
}

export interface SpecialistWithDistance extends Specialist {
  distance?: number;
  hospitalName?: string;
}

export type SortOption = 'relevance' | 'distance' | 'rating';

export interface SearchContextType {
  searchParams: SearchParams;
  updateSearchParams: (params: Partial<SearchParams>) => void;
  resetSearchParams: () => void;
  activeTab: 'hospitals' | 'specialists';
  setActiveTab: (tab: 'hospitals' | 'specialists') => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filters: FilterOption[];
  toggleFilter: (id: string) => void;
  addFilter: (filter: FilterOption) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
}
