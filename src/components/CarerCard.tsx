import { MapPin, Phone, Star, StarHalf, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance } from "@/lib/locationUtils";
import { motion } from "framer-motion";

interface CarerCardProps {
  carer: any;
  onViewDetails: (id: number) => void;
}

export default function CarerCard({ carer, onViewDetails }: CarerCardProps) {
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
    >
      <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 rounded-2xl">
        <div className="h-48 w-full overflow-hidden relative bg-gradient-to-br from-green-50 via-blue-50 to-slate-50 dark:from-green-900/30 dark:via-blue-900/30 dark:to-slate-900/30">
          {carer.imageUrl ? (
            <motion.img
              src={carer.imageUrl}
              alt="Care facility photo"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9S12 8.3 12 7.5V6.5L6 7V9C6 10.66 7.34 12 9 12V22H11V12H13V22H15V12C16.66 12 18 10.66 18 9H21Z"/>
                </svg>
              </div>
            </motion.div>
          )}
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {carer.name}
              </h3>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-none mb-3">
                {carer.serviceType}
              </Badge>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="text-gray-400 mr-2 h-4 w-4" />
                <span>{carer.address}, {carer.city}, {carer.state}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone className="text-gray-400 mr-2 h-4 w-4" />
                <span>{carer.phoneNumber}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="text-gray-400 mr-2 h-4 w-4" />
                <span>{carer.availability}</span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-1 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex">
                {renderStars(carer.rating || 0)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                {carer.rating ? carer.rating.toFixed(1) : '0.0'} ({carer.reviewCount || 0} reviews)
              </span>
            </motion.div>

            <motion.p
              className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {carer.description}
            </motion.p>

            <motion.div 
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {carer.specializations?.slice(0, 3).map((specialization: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none">
                    {specialization}
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
                {carer.distance !== null ? formatDistance(carer.distance) : 'Distance unknown'}
              </span>
              <div className="flex gap-3">
                <Button
                  size="sm" 
                  onClick={() => onViewDetails(carer.id)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}