import { MapPin, Phone, Building, Star, StarHalf, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance } from "@/lib/locationUtils";
import { motion } from "framer-motion";
import type { Specialist } from "@shared/schema";

interface SpecialistCardProps {
  specialist: Specialist;
  hospitalName?: string;
  onBookAppointment: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

export default function SpecialistCard({
  specialist,
  hospitalName,
  onBookAppointment,
  onViewDetails,
}: SpecialistCardProps) {
  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="text-yellow-400 fill-yellow-400 h-4 w-4"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="text-yellow-400 fill-yellow-400 h-4 w-4"
        />,
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="text-yellow-400 h-4 w-4" />,
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="mobile-tap"
    >
      <Card
        className="border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer card-hover"
        onClick={() => onViewDetails && onViewDetails(specialist.id)}
      >
        <CardContent className="p-6">
          {/* top section: name and rating (no image) */}
          <div>
            <h4 className="text-lg font-bold text-gray-900">
              {specialist.title || "Dr."} {specialist.firstName}{" "}
              {specialist.lastName}
            </h4>
            <p className="text-sm text-primary">
              {specialist.specialty} Specialist
            </p>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {renderStars(specialist.rating || 0)}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {specialist.rating ? specialist.rating.toFixed(1) : "0.0"} (
                {specialist.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          {/* contact details */}
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Building className="text-gray-400 mr-2 h-4 w-4" />
              <span>{hospitalName || "Independent Practice"}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <MapPin className="text-gray-400 mr-2 h-4 w-4" />
              <span>
                {specialist.address}, {specialist.city}, {specialist.state}{" "}
                {specialist.zipCode}
              </span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <Phone className="text-gray-400 mr-2 h-4 w-4" />
              <span>{specialist.phoneNumber}</span>
            </div>
          </div>

          {/* specialisations */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-900">
              Specializations
            </h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {specialist.subspecialties?.slice(0, 2).map((subspecialty, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {subspecialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* network/distance and “View Details” button */}
          <div className="mt-5 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-green-600">
                {specialist.isInNetwork ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    <span>In-network</span>
                  </>
                ) : (
                  <span className="text-gray-500">Out-of-network</span>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {specialist.distance !== null
                  ? formatDistance(specialist.distance)
                  : "Distance unknown"}
              </span>
            </div>
            <div className="flex justify-end">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/specialist/${specialist.id}`;
                  }}
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-transparent button-press ripple"
                >
                  View Details
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
