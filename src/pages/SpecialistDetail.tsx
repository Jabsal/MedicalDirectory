import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Building, 
  GraduationCap, 
  Star, 
  StarHalf, 
  Award, 
  Languages, 
  Clock,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewsList from "@/components/ReviewsList";
import SubscribeButton from "@/components/SubscribeButton";
import Footer from "@/components/Footer";

import type { Specialist, Hospital } from "@shared/schema";

export default function SpecialistDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("about");
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
  
  // Fetch specialist details
  const { data: specialist, isLoading: isLoadingSpecialist, error } = useQuery<Specialist>({
    queryKey: [`/api/specialists/${id}`],
  });
  
  // Fetch hospital details if specialist has a hospitalId
  const { data: hospital } = useQuery<Hospital>({
    queryKey: [`/api/hospitals/${specialist?.hospitalId}`],
    enabled: !!specialist?.hospitalId,
  });
  
  const handleBookAppointment = () => {
    toast({
      title: "Appointment Request",
      description: "We'll contact you shortly to schedule your appointment.",
    });
  };
  
  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 fill-yellow-400 h-5 w-5" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-yellow-400 fill-yellow-400 h-5 w-5" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400 h-5 w-5" />);
    }

    return stars;
  };
  
  if (isLoadingSpecialist) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex items-start">
            <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
            <div className="ml-6 flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !specialist) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Specialist not found</h2>
        <p className="mt-2 text-gray-600">The specialist you're looking for doesn't exist or has been removed.</p>
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
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <img
                  src={specialist.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                  alt={`Dr. ${specialist.firstName} ${specialist.lastName}`}
                  className="h-32 w-32 rounded-full object-cover"
                />
              </div>
              <div className="md:ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {specialist.title || "Dr."} {specialist.firstName} {specialist.lastName}
                </h1>
                <p className="text-lg text-primary">{specialist.specialty} Specialist</p>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {renderStars(specialist.rating || 0)}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {specialist.rating ? specialist.rating.toFixed(1) : '0.0'} ({specialist.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <Button 
                    onClick={() => {
                      setActiveTab("reviews");
                      setIsAddingReview(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" /> Write a Review
                  </Button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {specialist.subspecialties?.map((subspecialty, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {subspecialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Button className="bg-primary hover:bg-primary-600" onClick={handleBookAppointment}>
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                  </Button>
                  <Button variant="outline">View Available Times</Button>
                  <SubscribeButton 
                    subscriptionType="specialty"
                    entityId={specialist.id}
                    entityName={`Dr. ${specialist.firstName} ${specialist.lastName}`}
                    variant="outline"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                <div className="mt-3 space-y-3">
                  {hospital && (
                    <div className="flex items-start">
                      <Building className="text-primary mt-1 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-gray-900 font-medium">Hospital</p>
                        <p className="text-gray-600">{hospital.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <MapPin className="text-primary mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-gray-900 font-medium">Address</p>
                      <p className="text-gray-600">{specialist.address}, {specialist.city}, {specialist.state} {specialist.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="text-primary mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-gray-900 font-medium">Phone</p>
                      <p className="text-gray-600">{specialist.phoneNumber}</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-lg font-medium text-gray-900 mt-6">Education & Experience</h2>
                <div className="mt-3 space-y-3">
                  {specialist.education && (
                    <div className="flex items-start">
                      <GraduationCap className="text-primary mt-1 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-gray-900 font-medium">Education</p>
                        <p className="text-gray-600">{specialist.education}</p>
                      </div>
                    </div>
                  )}
                  {specialist.yearsOfExperience && (
                    <div className="flex items-start">
                      <Award className="text-primary mt-1 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-gray-900 font-medium">Experience</p>
                        <p className="text-gray-600">{specialist.yearsOfExperience} years</p>
                      </div>
                    </div>
                  )}
                  {specialist.languages && specialist.languages.length > 0 && (
                    <div className="flex items-start">
                      <Languages className="text-primary mt-1 mr-3 h-5 w-5" />
                      <div>
                        <p className="text-gray-900 font-medium">Languages</p>
                        <p className="text-gray-600">{specialist.languages.join(", ")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900">Practice Information</h2>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start">
                    <Clock className="text-primary mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-gray-900 font-medium">Accepting New Patients</p>
                      <p className="text-gray-600">
                        {specialist.acceptingNewPatients ? "Yes, currently accepting new patients" : "Not accepting new patients at this time"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className={`${specialist.isInNetwork ? 'text-green-500' : 'text-gray-400'} mt-1 mr-3 h-5 w-5`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Insurance</p>
                      <p className={`${specialist.isInNetwork ? 'text-green-600' : 'text-gray-600'}`}>
                        {specialist.isInNetwork ? "In-network with most major insurances" : "Out-of-network with most insurances"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-lg font-medium text-gray-900 mt-6">Specializations</h2>
                <div className="mt-3">
                  <p className="text-gray-600">
                    Dr. {specialist.lastName} specializes in {specialist.specialty.toLowerCase()} 
                    {specialist.subspecialties && specialist.subspecialties.length > 0 && 
                      `, with particular focus on ${specialist.subspecialties.join(" and ")}`
                    }.
                  </p>
                  
                  {hospital && (
                    <div className="mt-4">
                      <p className="text-gray-600">
                        Currently practicing at {hospital.name}, one of the leading medical facilities in {hospital.city}.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Patient Reviews Preview Card */}
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
                      {specialist.rating?.toFixed(1) || '0.0'}
                    </div>
                    <div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(specialist.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < (specialist.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        {specialist.reviewCount || 0} reviews
                      </span>
                    </div>
                  </div>
                  
                  {specialist.reviewCount ? (
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
                      <p className="text-gray-600 text-sm mb-3">Be the first to review Dr. {specialist.lastName}</p>
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
              </div>
              
              <Separator className="my-6" />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Reviews
                    {specialist.reviewCount ? <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{specialist.reviewCount}</span> : null}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <h2 className="text-lg font-medium text-gray-900">About Dr. {specialist.lastName}</h2>
                  <div className="mt-3">
                    <p className="text-gray-600">
                      {specialist.bio || `Dr. ${specialist.firstName} ${specialist.lastName} is a talented ${specialist.specialty.toLowerCase()} specialist with ${specialist.yearsOfExperience || ''} years of experience. Dr. ${specialist.lastName} is committed to providing comprehensive, personalized care to all patients.`}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="reviews-tab-content">
                  <ReviewsList 
                    specialistId={parseInt(id)} 
                    initialAddingReview={isAddingReview} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
