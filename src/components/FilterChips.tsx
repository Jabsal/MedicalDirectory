import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { FilterOption } from "@/lib/types";

interface FilterChipsProps {
  filters: FilterOption[];
  onToggleFilter: (id: string) => void;
}

export default function FilterChips({ filters, onToggleFilter }: FilterChipsProps) {
  // Only show active filters in the chips
  const activeFilters = filters.filter(filter => filter.active);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-slate-700/30 shadow-lg"
    >
      <div className="flex flex-wrap items-center gap-3">
        <AnimatePresence>
          {activeFilters.map((filter) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="inline-flex rounded-full items-center py-2 pl-4 pr-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-700 dark:from-blue-900/30 dark:to-emerald-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30"
            >
              <span>{filter.label}</span>
              <motion.button
                type="button"
                onClick={() => onToggleFilter(filter.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="ml-2 inline-flex flex-shrink-0 h-6 w-6 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 dark:hover:bg-blue-800/50 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">Remove filter</span>
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
