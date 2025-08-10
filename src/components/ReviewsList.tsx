import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Review } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

interface ReviewsListProps {
  hospitalId?: number;
  specialistId?: number;
  // Temporary user ID until user authentication is implemented
  userId?: number;
  // Option to start with the review dialog open
  initialAddingReview?: boolean;
}

export default function ReviewsList({ hospitalId, specialistId, userId = 1, initialAddingReview = false }: ReviewsListProps) {
  const [isAddingReview, setIsAddingReview] = useState(initialAddingReview);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const endpoint = hospitalId 
    ? `/api/reviews/hospital/${hospitalId}` 
    : specialistId 
      ? `/api/reviews/specialist/${specialistId}`
      : '';
  
  const { data: reviews, isLoading, refetch } = useQuery<Review[]>({
    queryKey: [endpoint],
    enabled: !!endpoint
  });
  
  const handleReviewSuccess = () => {
    setIsAddingReview(false);
    refetch();
  };
  
  const handleReviewUpdated = () => {
    refetch();
  };
  
  // Update isAddingReview when initialAddingReview prop changes
  useEffect(() => {
    if (initialAddingReview) {
      setIsAddingReview(true);
    }
  }, [initialAddingReview]);
  
  // Filter reviews based on active tab
  const filteredReviews = reviews?.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'positive' && review.rating >= 4) return true;
    if (activeTab === 'critical' && review.rating <= 2) return true;
    if (activeTab === 'verified' && review.isVerified) return true;
    return false;
  });
  
  if (!hospitalId && !specialistId) {
    return <div className="text-center py-8">No provider selected</div>;
  }
  
  const entityType = hospitalId ? 'Hospital' : 'Specialist';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Reviews</h2>
        
        <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[750px]">
            <DialogTitle>Write Your Review</DialogTitle>
            <ReviewForm
              hospitalId={hospitalId}
              specialistId={specialistId}
              userId={userId}
              onSuccess={handleReviewSuccess}
              onCancel={() => setIsAddingReview(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="verified">Verified Visits</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredReviews && filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onReviewUpdated={handleReviewUpdated}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 my-8">
                  No {activeTab === 'all' ? '' : activeTab} reviews yet for this {entityType.toLowerCase()}.
                </p>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setIsAddingReview(true)}
                >
                  <PlusCircle className="h-5 w-5" />
                  Be the first to write a review
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}