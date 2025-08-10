import { Link } from "wouter";
import { MapPin, Phone, Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance } from "@/lib/locationUtils";
import { motion } from "framer-motion";
import HospitalSilhouette from "./HospitalSilhouette";

import type { Hospital } from "@shared/schema";

interface HospitalCardProps {
  hospital: Hospital;
  onViewDetails: (id: number) => void;
}

export default function HospitalCard({ hospital, onViewDetails }: HospitalCardProps) {
  const renderStars = (rating: number | null = 0) => {
    const ratingValue = rating || 0;
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="mobile-tap"
    >
      <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 rounded-2xl">
        <div className="h-48 w-full overflow-hidden relative bg-gradient-to-br from-blue-50 via-emerald-50 to-slate-50 dark:from-blue-900/30 dark:via-emerald-900/30 dark:to-slate-900/30">
          {hospital.imageUrl ? (
            <motion.img
              src={hospital.imageUrl}
              alt={`${hospital.name} exterior`}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100"><div class="w-full h-full"><svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></div></div>`;
                }
              }}
            />
          ) : (
            <motion.div
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <HospitalSilhouette className="w-full h-full" />
            </motion.div>
          )}
          <div className="absolute top-2 right-2">
            {hospital.isTopRated && (
              <Badge className="badge-premium text-white">
                Verified
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-3 line-clamp-2">
                {hospital.name}
              </h3>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-3">
                <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mr-2">
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="line-clamp-1 font-medium">
                  {hospital.city}, {hospital.state}
                </span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-4">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-2">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">{hospital.phoneNumber}</span>
              </div>
              
              <motion.div 
                className="flex items-center justify-between mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  {renderStars(hospital.rating)}
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    ({hospital.rating?.toFixed(1) || "No rating"})
                  </span>
                </div>
                {hospital.isTopRated && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-none shadow-lg">
                      Top Rated
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                className="mt-4 flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {hospital.specialties?.slice(0, 3).map((specialty, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none">
                      {specialty}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-6 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {hospital.distance !== null ? formatDistance(hospital.distance) : 'Distance unknown'}
                </span>
                <div className="flex gap-3">
                  <Button
                    size="sm" 
                    onClick={() => onViewDetails(hospital.id)}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:scale-105 transition-transform duration-200 shadow-lg"
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}