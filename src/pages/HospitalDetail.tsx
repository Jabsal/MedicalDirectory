import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Globe, 
  Award, 
  Clock, 
  Microscope, 
  CheckCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpecialistCard from "@/components/SpecialistCard";
import ReviewsList from "@/components/ReviewsList";
import SubscribeButton from "@/components/SubscribeButton";
import Footer from "@/components/Footer";

import type { Hospital, Specialist } from "@shared/schema";

export default function HospitalDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("specialists");
  const [isAddingReview, setIsAddingReview] = useState(false);
  
  // Reset isAddingReview state after it's been passed to ReviewsList
  useEffect(() => {
    if (isAddingReview) {
      // Add a small delay to ensure the state has been passed
      const timeout = setTimeout(() => {
        setIsAddingReview(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAddingReview]);
  
  // Fetch hospital details
  const { data: hospital, isLoading: isLoadingHospital, error } = useQuery<Hospital>({
    queryKey: [`/api/hospitals/${id}`],
  });
  
  // Fetch specialists at this hospital
  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: [`/api/specialists/hospital/${id}`],
    enabled: !!id,
  });
  
  const handleViewDetails = (specialistId: number) => {
    setLocation(`/specialist/${specialistId}`);
  };
  
  if (isLoadingHospital) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-6"></div>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !hospital) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Hospital not found</h2>
        <p className="mt-2 text-gray-600">The hospital you're looking for doesn't exist or has been removed.</p>
        <Button
          onClick={() => setLocation("/")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to search
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to search
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{hospital.name}</h1>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(hospital.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < (hospital.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {hospital.rating ? hospital.rating.toFixed(1) : '0.0'} ({hospital.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setActiveTab("reviews");
                  setIsAddingReview(true);
                }}
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" /> Write a Review
              </Button>
              
              {/* Subscribe Button */}
              <SubscribeButton 
                subscriptionType="hospital"
                entityId={hospital.id}
                entityName={hospital.name}
                variant="outline"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <img
              src={hospital.imageUrl || "https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
              alt={`${hospital.name}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="mt-4 flex flex-wrap gap-3">
              {hospital.isTopRated && (
                <Badge className="bg-blue-100 text-blue-800 border-0 flex items-center">
                  <Award className="mr-1 h-4 w-4" /> Top Rated
                </Badge>
              )}
              {hospital.isEmergency && (
                <Badge className="bg-green-100 text-green-800 border-0 flex items-center">
                  <Clock className="mr-1 h-4 w-4" /> 24/7 Emergency
                </Badge>
              )}
              {hospital.isResearch && (
                <Badge className="bg-purple-100 text-purple-800 border-0 flex items-center">
                  <Microscope className="mr-1 h-4 w-4" /> Research Institution
                </Badge>
              )}
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start">
                    <MapPin className="text-primary mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-gray-900 font-medium">Address</p>
                      <p className="text-gray-600">{hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="text-primary mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-gray-900 font-medium">Phone</p>
                      <p className="text-gray-600">{hospital.phoneNumber}</p>
                    </div>
                  </div>
                  {hospital.website && (
                    <div className="flex items-start">
                      <Globe className="text-primary mt-1 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-gray-900 font-medium">Website</p>
                        <a href={`https://${hospital.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-700">
                          {hospital.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900">Services & Departments</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {hospital.services?.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="text-green-500 h-4 w-4" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">About</h2>
              <p className="mt-2 text-gray-600">
                {hospital.description || 
                  `${hospital.name} is a leading healthcare facility providing comprehensive medical services
                  to patients in ${hospital.city} and surrounding areas. With a focus on patient care and
                  innovative treatments, we strive to deliver the highest quality healthcare services.`
                }
              </p>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Insurance & Payment</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.acceptedInsurance?.map((insurance, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                    {insurance}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Patient Review Preview Card */}
            <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Patient Reviews</h3>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("reviews")}
                  className="text-primary p-0 h-auto"
                >
                  View all
                </Button>
              </div>
              <div className="flex items-center mb-4">
                <div className="text-3xl font-bold text-gray-900 mr-3">
                  {hospital.rating?.toFixed(1) || '0.0'}
                </div>
                <div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(hospital.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : i < (hospital.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {hospital.reviewCount || 0} reviews
                  </span>
                </div>
              </div>
              
              {hospital.reviewCount ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("reviews");
                    setIsAddingReview(true);
                  }}
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" /> Write a Review
                </Button>
              ) : (
                <div className="text-center py-3">
                  <p className="text-gray-600 text-sm mb-3">Be the first to review {hospital.name}</p>
                  <Button
                    onClick={() => {
                      setActiveTab("reviews");
                      setIsAddingReview(true);
                    }}
                    className="w-full"
                  >
                    <Star className="h-4 w-4 mr-2" /> Write a Review
                  </Button>
                </div>
              )}
            </div>
            
            <Separator className="my-8" />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="mb-6">
                <TabsTrigger value="specialists" className="flex items-center gap-1">
                  Specialists
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Reviews
                  {hospital.reviewCount ? <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{hospital.reviewCount}</span> : null}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="specialists">
                <h2 className="text-xl font-bold text-gray-900">Specialists at {hospital.name}</h2>
                
                {specialists.length > 0 ? (
                  <div className="mt-6 results-grid">
                    {specialists.map((specialist) => (
                      <SpecialistCard
                        key={specialist.id}
                        specialist={specialist}
                        hospitalName={hospital.name}
                        onBookAppointment={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-gray-600">No specialists information available at this time.</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="reviews-tab-content">
                <ReviewsList 
                  hospitalId={parseInt(id)} 
                  initialAddingReview={isAddingReview}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
