import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertReviewSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';

// Extend the insert schema with validation rules
const formSchema = insertReviewSchema.extend({
  rating: z.number().min(1, 'Please provide a rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  hospitalId?: number;
  specialistId?: number;
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ 
  hospitalId, 
  specialistId, 
  userId,
  onSuccess,
  onCancel 
}: ReviewFormProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = React.useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalId: hospitalId || null,
      specialistId: specialistId || null,
      userId,
      rating: 5, // Start with 5 stars by default
      title: '',
      content: '',
      pros: '',
      cons: '',
      verifiedVisit: false,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      console.log('Submitting review data:', data);
      const response = await apiRequest('POST', '/api/reviews', data);
      console.log('Review submission response:', response);
      
      // Invalidate queries to refresh data
      if (hospitalId) {
        queryClient.invalidateQueries({ queryKey: [`/api/reviews/hospital/${hospitalId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/hospitals/${hospitalId}`] });
      }
      
      if (specialistId) {
        queryClient.invalidateQueries({ queryKey: [`/api/reviews/specialist/${specialistId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/specialists/${specialistId}`] });
      }
      
      toast({
        title: 'Review submitted',
        description: 'Thank you for sharing your experience!',
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'There was a problem submitting your review. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleStarClick = (rating: number) => {
    form.setValue('rating', rating);
  };
  
  const selectedRating = form.watch('rating');
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Share Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-colors ${
                            star <= (hoveredRating || selectedRating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                          onClick={() => handleStarClick(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Summarize your experience" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share details of your experience here..." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you like?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What went well..." 
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What could be improved?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What could have been better..." 
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="verifiedVisit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Verified Visit</FormLabel>
                    <FormDescription>
                      Check this box if you personally visited this healthcare provider
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">Submit Review</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}