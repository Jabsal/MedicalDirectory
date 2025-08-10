import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Flag, Star } from "lucide-react";
import { format } from "date-fns";
import { Review } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ReviewCardProps {
  review: Review;
  onReviewUpdated?: () => void;
}

export default function ReviewCard({ review, onReviewUpdated }: ReviewCardProps) {
  const { toast } = useToast();
  
  const handleMarkHelpful = async () => {
    try {
      await apiRequest(`/api/reviews/${review.id}/helpful`, 'POST');
      toast({
        title: "Review marked as helpful",
        description: "Thank you for your feedback!",
      });
      if (onReviewUpdated) onReviewUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark review as helpful",
        variant: "destructive",
      });
    }
  };
  
  const handleReportReview = async () => {
    try {
      await apiRequest(`/api/reviews/${review.id}/report`, 'POST');
      toast({
        title: "Review reported",
        description: "Thank you for your feedback. We'll review this content.",
      });
      if (onReviewUpdated) onReviewUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report review",
        variant: "destructive",
      });
    }
  };
  
  // Format the date
  const formattedDate = review.createdAt
    ? format(new Date(review.createdAt), 'MMM d, yyyy')
    : 'Unknown date';
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <h3 className="font-semibold text-lg">{review.title}</h3>
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        
        {review.isVerified && (
          <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">
            Verified Visit
          </Badge>
        )}
        
        <p className="text-gray-700 mb-4">{review.content}</p>
        
        {review.pros && (
          <div className="mb-2">
            <h4 className="font-medium text-green-700">Pros:</h4>
            <p className="text-sm text-gray-600">{review.pros}</p>
          </div>
        )}
        
        {review.cons && (
          <div className="mb-4">
            <h4 className="font-medium text-red-700">Cons:</h4>
            <p className="text-sm text-gray-600">{review.cons}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            {review.helpfulCount || 0} people found this helpful
          </span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleMarkHelpful}
          >
            <ThumbsUp className="h-4 w-4" />
            Helpful
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-red-600"
            onClick={handleReportReview}
          >
            <Flag className="h-4 w-4" />
            Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}